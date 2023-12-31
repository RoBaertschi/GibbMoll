import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import User from 'src/entities/User';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({ passReqToCallback: true });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const contextIdfick = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(
      AuthService,
      contextIdfick,
    );

    const user = await authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
