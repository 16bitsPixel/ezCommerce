import {
  Controller,
  Get,
  Route,
  SuccessResponse,
  Post,
  Security,
  Request
} from 'tsoa';
import { APIKey } from '.';
import { ApiService } from './service';
import * as express from 'express';

@Route('vendor/api')
export class APIKEYController extends Controller {
  @Security("jwt", ["vendor"])
  @Get('all-keys')
  @SuccessResponse('200',"All API Keys")
  public async getkeys(
    @Request() request: express.Request
  ): Promise<APIKey []>{
    return new ApiService().getvendorkey(`${request.user?.id}`);
  }


  @Security("jwt", ["member"])
  @Post('genrate-key')
  @SuccessResponse('201',"Vendor API Key Created")
  public async createapikey(
    @Request() request: express.Request,
  ): Promise<APIKey|undefined> {
    return new ApiService().createkey(`${request.user?.email}`, `${request.user?.name}`, `${request.user?.id}`);
  }
}
  