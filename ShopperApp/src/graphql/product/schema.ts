import { Field, ObjectType } from "type-graphql"
// import { Matches } from "class-validator";

@ObjectType('product')
export class Product {
  @Field()
    id!: string
  @Field()
    name!: string
  @Field(() => [String]) 
    description!: string[]
  @Field()
    price!: number
  @Field()
    rating!: number
  @Field(() => [String])
    image!: string[]
}
