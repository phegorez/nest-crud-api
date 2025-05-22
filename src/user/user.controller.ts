import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard';
import { EditUserDto } from './dto/indext';
import { UserService } from './user.service';



@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        // @GetUser('email') email: string
        // console.log({
        //     email: email
        // })
        return { message: 'This is the user profile', user: user };
    }

    @Patch()
    editUser(@GetUser() user: User, @Body() dto: EditUserDto) {
        return this.userService.editUser(user.id, dto);
    }
}
