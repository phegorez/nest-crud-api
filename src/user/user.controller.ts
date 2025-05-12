import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';

@Controller('user')
export class UserController {

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe() {
        return { message: 'This is the user profile' };
    }
}
