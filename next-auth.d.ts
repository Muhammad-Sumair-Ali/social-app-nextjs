import { DefaultSession } from "next-auth";

declare module "next-auth" {


  interface Session {
    user: {
      id: tring;
    } & DefaultSession["user"];
  }
  
}
