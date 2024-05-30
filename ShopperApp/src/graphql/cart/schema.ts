import { Field, ObjectType, InputType } from "type-graphql"
// import { Matches } from "class-validator";

@ObjectType('cartitem')
@InputType()
export class CartItem {
  @Field()
    id!: string
  @Field()
    quantity!: number
}
