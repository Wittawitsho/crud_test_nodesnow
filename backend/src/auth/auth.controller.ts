import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
    async login(@Request() req){
      const {accessToken} = await this.authService.login(req.user)
      
      return {accessToken}
    }
    @Post('/logout')
    async logout(@Res() res) {
      return res.json({ message: 'Logged out successfully' });
    }
  }
