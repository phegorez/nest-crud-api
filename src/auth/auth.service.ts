import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from '../../prisma/generated/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }

    async signup(dto: AuthDto) {
        // generate the password hash
        const hash = await argon.hash(dto.password);
        // save the new user in the db
        try {
            const newUser = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })

            // return the saved user
            const access_token = await this.signToken(newUser.id, newUser.email)
            return { access_token };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email already exists');
                }
            }
            throw error;
        }

    }

    async sigin(dto: AuthDto) {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });

        // if user does not exist throw exception
        if (!user) throw new ForbiddenException('Credentials incorrect');

        // compare password with hash
        const passwordMatches = await argon.verify(user.hash, dto.password);
        // if password is incorrect throw exception
        if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');
        // return the user

        const access_token = await this.signToken(user.id, user.email)
        return { access_token };
    }

    signToken(userId: number, email: string): Promise<string> {
        // create a payload
        const payload = {
            sub: userId,
            email,
        }
        // sign the token
        const token = this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET'),
        });
        return token;
    }

}
