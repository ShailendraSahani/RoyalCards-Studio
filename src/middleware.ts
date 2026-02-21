import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to auth pages
        if (pathname.startsWith('/auth')) {
          return true;
        }

        // Allow access to public pages
        if (pathname === '/' || pathname.startsWith('/cards')) {
          return true;
        }

        // Require authentication for protected routes
        if (pathname.startsWith('/dashboard') ||
            pathname.startsWith('/cart') ||
            pathname.startsWith('/checkout') ||
            pathname.startsWith('/book') ||
            pathname.startsWith('/download')) {
          return !!token;
        }

        // Require admin role for admin routes
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/book/:path*',
    '/download/:path*',
    '/admin/:path*',
  ],
};
