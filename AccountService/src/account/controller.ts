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
} from 'tsoa';

import { Authenticated, Credentials, SessionUser, SignupCred, VerifiedVendor } from '.';
import { AccountService } from './service';
import { UUID } from "../types/express";

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
        if (status == undefined) {
          this.setStatus(403)
        }
        else{
          return status
        }
      });
  }

  @Post('Vendor')
  @Response('404', 'Unknown')
  @SuccessResponse('200', "Updated succefully")
  public async AcceptVendor(
    @Query() vendorId: UUID,
  ): Promise<VerifiedVendor|undefined> {
    return new AccountService().acceptVendor(vendorId)
      .then(async (vendor: VerifiedVendor|undefined): Promise<VerifiedVendor|undefined> => {
        if (!vendor) {
          this.setStatus(404);
        }
        else{
          return vendor
        }
      });
  }
}

@Route('Vendor')
export class VendorController extends Controller {
  @Get()
  @SuccessResponse('200', "All accepted Vendors")
  public async AllVendors(): Promise<VerifiedVendor[]>{
    return new AccountService().getallVendors();
  }

  @Get('Pending')
  @SuccessResponse('200', "All Pending Vendors")
  public async AllPendingVendors(): Promise<VerifiedVendor[]>{
    return new AccountService().getallpendingVendors();
  }
}
