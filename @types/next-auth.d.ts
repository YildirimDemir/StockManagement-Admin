import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin";
    username: string; 
    email: string;
    name: string; 
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin";
      email: string;
      username: string; 
      name: string; 
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "admin";
    email: string;
    username: string; 
    name: string
  }
}