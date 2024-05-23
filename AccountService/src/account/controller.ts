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
  SuccessResponse,
  Security,
  Request
} from 'tsoa';

import * as express from 'express';

import { Authenticated, Credentials, SessionUser, SignupCred, CartItem, CartAdd } from '.';
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

@Route('Signup')
export class SignupController extends Controller {
  @Post()
  @Response('409', 'Already Exists')
  @SuccessResponse('201', 'Account created')
  public async Signup(
    @Body() cred: SignupCred,
  ): Promise<boolean|undefined> {
    return new AccountService().Signup(cred)
      .then(async (created: boolean|undefined): Promise<boolean|undefined> => {
        if (!created) {
          this.setStatus(409)
        }
        return created
      });
  }
}

@Route('Verify')
export class VerifyController extends Controller {
  @Post()
  @Response('403', 'Forbidden')
  public async Verified(
    @Body() cred: Credentials,
  ): Promise<boolean|undefined> {
    return new AccountService().isVerified(cred)
      .then(async (status: boolean|undefined): Promise<boolean|undefined> => {
        if (!status) {
          this.setStatus(403)
        }
        return status
      });
  }
}

@Route('Cart')
export class CartController extends Controller {
  @Get()
  @Security("jwt", ["member"])
  @Response('401', 'Unauthorised')
  public async GetCart(
    @Query() accountId: string,
    @Request() request: express.Request
  ): Promise<CartItem[]> {
    return new AccountService().getCart(accountId);
  }

  @Post()
  @SuccessResponse('201', 'Added to Cart')
  public async AddToCart(
    @Body() productAccountInfo: CartAdd
  ): Promise<CartItem> {
    return new AccountService().addToCart(productAccountInfo);
  }
}
