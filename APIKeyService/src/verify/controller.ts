import {
  Controller,
  Route,
  SuccessResponse,
  Post,
  Response,
  Body,
} from 'tsoa';
import {Key} from ".";
import { verificationService } from './service';
  
@Route('vendor/verify')
export class verification extends Controller {
    @Post()
    @Response('401', "Unauthorized")
    @SuccessResponse('200',"Vendor Authorized")
  public async createapikey(
      @Body() vendorapikey: Key,
  ): Promise<Key|undefined> {
    return new verificationService().verify(vendorapikey.apikey)
      .then(async(found: string|undefined): Promise<Key|undefined>=>{
        if (!found){
          this.setStatus(401);
        }
        else{
          return {apikey: found}
        }
      });
  }
}
    