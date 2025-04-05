import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDatabase } from "./db";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { ObjectId } from "mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing Email or password");
        }
        
        try {
          await connectDatabase();
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error("No user found");
          }
          
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
        
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await connectDatabase();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // If user exists, use their MongoDB _id
            user.id = existingUser._id.toString();
          } else {
            // Generate a random password for OAuth users
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 12);
            
            // Create new user with required fields
            const newUser = new User({
              _id: new ObjectId(),
              email: user.email,
              fullName: profile?.name || user.name || `User_${Date.now().toString().slice(-5)}`,
              password: hashedPassword,
              image: user.image || "/default-avatar.png",
              emailVerified: new Date(),
              provider: account.provider
            });
            
            await newUser.save();
            user.id = newUser._id.toString();
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      
      return true;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  
  secret: process.env.NEXTAUTH_SECRET
};