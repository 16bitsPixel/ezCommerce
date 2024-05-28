import { Field, ObjectType, ArgsType, InputType } from "type-graphql"
import { Length, IsUUID } from "class-validator";

@ArgsType()
export class Credentials {
  @Field()
  @Length(4, 16)
    email!: string
  @Field()
  @Length(8, 16)
    password!: string
}

@ObjectType()
export class Authenticated {
  @Field()
    name!: string
  @Field()
    accessToken!: string
  @Field()
    role!: string
}

@ArgsType()
export class SignupCred {
  @Field()
    role!: string
  @Field()
    firstname!: string
  @Field()
    lastname!: string
  @Field()
    email!: string
  @Field()
    password!: string
}
@ObjectType()
export class Vendor {
  @Field()
  @IsUUID()
    vendorId!: string 
  @Field()
    accepted!: string
  @Field()
    name!: string
}
@InputType()
export class VendorId{
  @Field()
  @IsUUID()
    id!: string
}

