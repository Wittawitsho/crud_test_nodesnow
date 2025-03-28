import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private userService: UserService,
    private jwtService: JwtService
  ){
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const result = user.get();
      return {
        userId: result.id,
        email: result.email
      }
    }
    console.log('Invalid credentials');
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
