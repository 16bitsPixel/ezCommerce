import { Field, ObjectType } from "type-graphql"
// import { Matches } from "class-validator";

@ObjectType('product')
export class Product {
  @Field()
    id!: string
  @Field()
    name!: string
  @Field() 
    description!: string
  @Field()
    price!: number
  @Field()
    rating!: number
  @Field()
    image!: string
}
