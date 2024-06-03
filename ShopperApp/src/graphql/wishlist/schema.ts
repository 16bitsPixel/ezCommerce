import { Field, InputType, ObjectType } from "type-graphql"
@ObjectType('WishList')
export class WishList {
  @Field()
    id!: string
  @Field()
    Productname!: string
  @Field()
    Productid!: string
  @Field(() => [String]) 
    description!: string[]
  @Field()
    price!: number
  @Field()
    rating!: number
  @Field(() => [String])
    image!: string[]
}
@InputType('WishListInput')
export class WishListInput{
  @Field()
    Productname!: string
  @Field()
    Productid!: string
  @Field(() => [String]) 
    description!: string[]
  @Field()
    price!: number
  @Field()
    rating!: number
  @Field(() => [String])
    image!: string[]
}
