import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db();
          const user = await db
            .collection("users")
            .findOne({ email: credentials.email });

          if (!user) throw new Error("User not found");

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) throw new Error("Invalid password");

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      session.user.role = token.role || "user";
      return session;
    },
    async signIn({ user, account }) {
      try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");

        if (account?.provider !== "credentials") {
          const existing = await users.findOne({ email: user.email });

          if (existing && !existing.oauthProvider) {
            await users.updateOne(
              { _id: existing._id },
              { $set: { oauthProvider: account.provider } }
            );
            user.id = existing._id.toString();
            user.role = existing.role || "user";
            return true;
          }

          if (!existing) {
            const result = await users.insertOne({
              email: user.email,
              name: user.name,
              oauthProvider: account.provider,
              role: "user",
              createdAt: new Date(),
            });
            user.id = result.insertedId.toString();
            user.role = "user";
          } else {
            user.role = existing.role || "user";
          }
        }

        return true;
      } catch (error) {
        console.error("signIn callback error:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };