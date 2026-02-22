import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        mobile: { label: 'Mobile', type: 'tel' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorize called with mobile:', credentials?.mobile);
        if (!credentials?.mobile || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          await dbConnect();

          const user = await User.findOne({ mobile: credentials.mobile });
          console.log('User found:', user);

          if (!user) {
            console.log('No user found');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          const userData = {
            id: user._id.toString(),
            email: user.mobile,
            name: user.name,
            role: user.role || 'user',
            isSeller: user.isSeller || false,
            sellerRequestStatus: user.sellerRequestStatus || 'none',
          };
          console.log('Returning user data:', userData);
          return userData;
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - User:', user);
      if (user) {
        token.role = user.role || 'user';
        token.isSeller = user.isSeller || false;
        token.sellerRequestStatus = user.sellerRequestStatus || 'none';
        console.log('JWT Token set - role:', token.role);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Token:', token);
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) || 'user';
        session.user.isSeller = (token.isSeller as boolean) || false;
        session.user.sellerRequestStatus = (token.sellerRequestStatus as string) || 'none';
        console.log('Session User set - role:', session.user.role);
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
};
