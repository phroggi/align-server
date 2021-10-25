// import "reflect-metadata";
// import { ObjectType, Field, ID } from "type-graphql";
// import Product from "./Product";

// @ObjectType({
//   isAbstract: true,
// })
// export default class Collection {
//   @Field((_type) => ID)
//   id!: number;

//   @Field((_type) => String)
//   title!: string;

//   @Field((_type) => String)
//   slug!: string;

//   @Field((_type) => Date, {
//     nullable: false,
//   })
//   createdAt!: Date;

//   @Field((_type) => Date, {
//     nullable: false,
//   })
//   updatedAt!: Date;
//   @Field((_type) => [Product])
//   products: Product[];
// }
