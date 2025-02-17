import NextAuth from "next-auth";
import { authConfig } from "./server/auth.config";

const PROTECTED_ROUTES = ["/", "/room", "/room/:id*", "/api"];

const PUBLIC_ROUTES = ["/signin", "/signup"];

const LOGIN_REDIRECT = "/signin";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;
	const isAuthenticated = !!req.auth;

	const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
		const pattern = route.replace(/:\w+\*/, ".*").replace(/:\w+/, "[^/]+");
		return new RegExp(`^${pattern}$`).test(nextUrl.pathname);
	});

	const isPublicRoute = PUBLIC_ROUTES.some((route) =>
		new RegExp(`^${route.replace(/:\w+/, "[^/]+")}$`).test(nextUrl.pathname),
	);

	const isLoginPage = nextUrl.pathname === LOGIN_REDIRECT;

	if (isAuthenticated && isLoginPage) {
		return Response.redirect(new URL("/", nextUrl));
	}

	if (!isAuthenticated && isProtectedRoute) {
		const redirectUrl = new URL(LOGIN_REDIRECT, nextUrl);
		redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
		return Response.redirect(redirectUrl);
	}
});

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
