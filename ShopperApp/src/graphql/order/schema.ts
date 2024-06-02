import { Field, ObjectType, InputType } from "type-graphql"
// import { Matches } from "class-validator";

@ObjectType('order')
export class Order {
  @Field()
    orderId!: string
  @Field()
    accountId!: string
  @Field(() => [String]) 
    productId!: string[]
  @Field(() => Date)
    date!: Date
  @Field()
    status!: string
  @Field(() => [Number])
    quantities!: number[]
}

@InputType()
export class InputOrder {
  @Field()
    accountId!: string
  @Field(() => [String]) 
    productId!: string[]
  @Field(() => [Number])
    quantities!: number[]
}