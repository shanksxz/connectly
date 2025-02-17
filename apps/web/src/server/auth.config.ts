import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        authorized({ auth }) {
            const isAuthenticated = !!auth?.user;
            return isAuthenticated;
        },
    },
    providers: [],
} satisfies NextAuthConfig;