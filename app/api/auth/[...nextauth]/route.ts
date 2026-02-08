import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: any }) {
      // SOLO ESTE CORREO SERÁ ADMIN
      const adminEmail = "urbinaa363@gmail.com"

      if (user?.email === adminEmail) {
        user.role = "admin"
      } else {
        user.role = "user"
      }

      return true
    },

    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role
      }
      return token
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }