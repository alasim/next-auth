import client from "../../../lib/client";
import { hash, compare } from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // maxAge: 60,
  },
  jwt: {
    maxAge: 30,
  },
  adapter: PrismaAdapter(client),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        // perform you login logic
        // find out user from db
        const user = await client.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) throw new Error("user not found");
        console.log({
          id: user.id,
          name: user.name,
          email: user.email,
        });

        if (!(await compare(password, user.password))) {
          throw new Error("invalid credentials");
        }

        // if everything is fine
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const data = await client.user.findUnique({
        where: {
          email: user.email as string,
        },
      });
      // if (!data) throw new Error("user not found");
      // if (!data) {
      //   return "/auth/error";
      // }
      console.log("signIn called...", {
        user,
        account,
        profile,
        email,
        credentials,
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      //   console.log("redirect called.................", { url, baseUrl });
      return baseUrl;
    },
    async session({ session, user, token }) {
      // console.log("session called..", {
      //   session,
      //   user,
      //   token,
      // });
      return session;
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("jwt called..", {
      //   token,
      //   user,
      //   account,
      //   profile,
      //   isNewUser,
      // });
      return token;
    },
  },
  events: {
    async signIn(props) {
      // console.log({ props });
    },
  },
};

export default NextAuth(authOptions);
