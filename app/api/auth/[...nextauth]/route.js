import NextAuth from 'next-auth';
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";


export const authoptions = NextAuth({
    providers: [
      // OAuth authentication providers...
      GitHubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET
        }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      })
    ],
    callbacks: {
        async jwt({ token, account }) {
          if (account) {
            // Create a JWT when the user logs in
            token.accessToken = jwt.sign(
              { email: token.email, name: token.name },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );
          }
          return token;
        },
        async session({ session, token }) {
          session.accessToken = token.accessToken;
          return session;
        },
      },
      session: {
        strategy: "jwt",
      },
  })
  
  export { authoptions as GET,authoptions as POST }