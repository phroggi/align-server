import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { Resolver, Mutation, Arg, Field, Ctx, ObjectType, Query } from "type-graphql";

import { User } from "../models/User";
import { MyContext } from "../types";
import { COOKIE_NAME } from "../utils/constants";

// eslint-disable-next-line import/no-unresolved

const prisma = new PrismaClient();

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class AuthResolver {
  @Query(() => User)
  async userById(@Arg("id") id: number) {
    const user = prisma.user.findUnique({
      where: { id },
    });

    return {
      user,
    };
  }

  // @FieldResolver(() => String)
  // email(@Root() user: User, @Ctx() { req }: MyContext) {
  //   // this is the current user and its ok to show them their own email
  //   if (req.session.userId === user.id) {
  //     return user.email;
  //   }
  //   // current user wants to see someone elses email
  //   return "";
  // }

  // @Mutation(() => UserResponse)
  // async changePassword(
  //   @Arg("token") token: string,
  //   @Arg("newPassword") newPassword: string,
  //   @Ctx() { redis, req }: MyContext
  // ): Promise<UserResponse> {
  //   if (newPassword.length <= 2) {
  //     return {
  //       errors: [
  //         {
  //           field: "newPassword",
  //           message: "length must be greater than 2",
  //         },
  //       ],
  //     };
  //   }

  //   const key = FORGET_PASSWORD_PREFIX + token;
  //   const userId = await redis.get(key);
  //   if (!userId) {
  //     return {
  //       errors: [
  //         {
  //           field: "token",
  //           message: "token expired",
  //         },
  //       ],
  //     };
  //   }
  //   const userIdNum = parseInt(userId);
  //   const user = await

  // }
  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "that email doesn't exsist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }
  @Mutation(() => Boolean)
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (!email.includes("@")) {
      return {
        errors: [
          {
            field: "email",
            message: "invalid email",
          },
        ],
      };
    }

    if (password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    req.session.userId = user.id;

    return {
      user,
    };
  }
}
