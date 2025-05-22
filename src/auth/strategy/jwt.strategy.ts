import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy, AuthGuard } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { payloadType } from "types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET') as string,
        })
    }

    async validate(payload: payloadType) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });

        delete (user as any).hash;  
        return user;
    }
}