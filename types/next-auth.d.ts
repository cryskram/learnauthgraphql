import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "REG";
      name?: string | null;
      email?: string | null;
      image?: string | null;
      items: string[];
    };
  }

  interface User {
    role: "ADMIN" | "REG";
    items: string[];
  }
}
