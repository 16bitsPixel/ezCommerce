import {
  Controller,
  Get,
  Route,
  SuccessResponse,
  Query,
  Post,
  Body,
} from 'tsoa';
  
import { APIKey, Vendor } from '.';
import { ApiService } from './service';

@Route('vendor/api')
export class APIKEYController extends Controller {
    @Get('all-keys')
    @SuccessResponse('200',"All API Keys")
  public async getkeys(
  ): Promise<APIKey []>{
    return new ApiService().getkeys();
  }

  @Get('vendor-keys')
  @SuccessResponse('200',"Vendor API Keys")
    public async getkey(
    @Query() vendorid: string,
    ): Promise<APIKey []> {
      return new ApiService().getvendorkey(vendorid);
    }

  @Post('genrate-key')
  @SuccessResponse('201',"Vendor API Key Created")
  public async createapikey(
    @Body() vendorid: Vendor,
  ): Promise<string|undefined> {
    return new ApiService().createkey(vendorid);
  }
}
  