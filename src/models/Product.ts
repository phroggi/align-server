/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";
@ObjectType({
  isAbstract: true,
})
export default class Product {
  @Field((_type) => ID, {
    nullable: false,
  })
  id!: number;

  @Field((_type) => String, {
    nullable: false,
  })
  image?: string;

  @Field((_type) => String, {
    nullable: false,
  })
  title!: string;

  @Field((_type) => String, {
    nullable: false,
  })
  description!: string;

  @Field({
    nullable: false,
  })
  price!: number;

  @Field((_type) => String, {
    nullable: false,
  })
  slug!: string;

  @Field((_type) => String, {
    nullable: false,
  })
  features!: string;

  // @Field((_type) => [Collection], {
  //   nullable: "itemsAndList",
  // })
  // collections!: string;

  @Field((_type) => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field((_type) => Date, {
    nullable: false,
  })
  updatedAt!: Date;
}
