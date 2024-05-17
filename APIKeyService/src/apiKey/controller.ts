import {
  Controller,
  Get,
  Route,
  SuccessResponse,
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
}
  