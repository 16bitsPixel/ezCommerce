import {
  Controller,
  Get,
  Route,
  SuccessResponse,
  Query,
  Post,
  Body,
} from 'tsoa';
  
import { APIKey } from '.';
import { ApiService } from './service';

@Route('vendor/api')
export class APIKEYController extends Controller {
    @Get()
    @SuccessResponse('200',"All API Keys")
  public async getkeys(
  ): Promise<APIKey []>{
    return new ApiService().getkeys();
  }

  @Get()
  @SuccessResponse('200',"Vendor API Keys")
  public async getkey(
    @Query() vendorid: string,
  ): Promise<APIKey []> {
    return new ApiService().getvendorkey(vendorid);
  }

  @Post()
  @SuccessResponse('201',"Vendor API Key Created")
  public async createapikey(
    @Body() vendorid: string,
  ): Promise<string|undefined> {
    return new ApiService().createkey(vendorid);
  }
}
  