/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import {
  Body,
  Query,
  Controller,
  Post,
  Get,
  Response,
  Route,
} from 'tsoa';

import { Authenticated, Credentials, SessionUser } from '.';
import { AccountService } from './service';

@Route('authenticate')
export class AccountController extends Controller {
  @Post()
  @Response('401', 'Unauthorized')
  public async login(
    @Body() credentials: Credentials,
  ): Promise<Authenticated|undefined> {
    return new AccountService().login(credentials)
      .then(async (account: Authenticated|undefined): Promise<Authenticated|undefined> => {
        if (!account) {
          this.setStatus(401)
        }
        return account
      });
  }

  @Get()
  @Response('401', 'Unauthorized')
  public async check(
    @Query() accessToken: string,
  ): Promise<SessionUser|undefined> {
    return new AccountService().check(accessToken)
      .then(async (account: SessionUser|undefined): Promise<SessionUser|undefined> => {
        if (!account) {
          this.setStatus(401)
        }
        return account
      });
  }
}

