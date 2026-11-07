import { NextAuthOptions, DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './db'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: string
      region: string
      matricule: string | null
      avatarColor: string
    }
  }
  interface User {
    role: string
    region: string
    matricule: string | null
    avatarColor: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    role: string
    region: string
    matricule: string | null
    avatarColor: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user || !user.password || !user.isActive) return null

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          region: user.region ?? 'ALL',
          matricule: user.matricule,
          avatarColor: user.avatarColor ?? '2563A8',
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
        token.region = user.region
        token.matricule = user.matricule
        token.avatarColor = user.avatarColor
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId
        session.user.role = token.role
        session.user.region = token.region
        session.user.matricule = token.matricule
        session.user.avatarColor = token.avatarColor
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
}
