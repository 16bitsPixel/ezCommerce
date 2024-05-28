import { Field, ObjectType } from "type-graphql"
// import { Matches } from "class-validator";

@ObjectType('cartitem')
export class CartItem {
  @Field()
    id!: string
  @Field()
    quantity!: number
}
