import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      isSeller?: boolean;
      sellerRequestStatus?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    isSeller?: boolean;
    sellerRequestStatus?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    isSeller?: boolean;
    sellerRequestStatus?: string;
  }
}
