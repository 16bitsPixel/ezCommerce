import { Field, ObjectType, ArgsType } from "type-graphql"
import { Length } from "class-validator";

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
}

@ObjectType()
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
