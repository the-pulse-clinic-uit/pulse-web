import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "localhost:3000";
const SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    let currentHost = "";

    const hostWithoutPort = hostname.split(":")[0];
    const rootDomainWithoutPort = ROOT_DOMAIN.split(":")[0];

    // Extract subdomain
    const hostParts = hostWithoutPort.split(".");

    // Check if it's a Vercel domain
    if (hostname.includes("vercel.app")) {
        // For vercel.app: hms.pulse-web-galt.vercel.app (4 parts = subdomain)
        // pulse-web-galt.vercel.app (3 parts = root)
        if (hostParts.length >= 4) {
            currentHost = hostParts[0];
        }
    } else if (hostname.includes("localhost")) {
        // For localhost: hms.localhost (2 parts = subdomain), localhost (1 part = root)
        if (hostParts.length >= 2) {
            currentHost = hostParts[0];
        }
    } else {
        // For custom domains like pulse-clinic.xyz
        // hms.pulse-clinic.xyz (4 parts = subdomain)
        // www.pulse-clinic.xyz or pulse-clinic.xyz (3 or 2 parts = root)
        const rootParts = rootDomainWithoutPort.split(".");

        // Only extract subdomain if we have MORE parts than the configured root domain
        // AND the hostname ends with the root domain
        if (
            hostParts.length > rootParts.length &&
            hostWithoutPort.endsWith(rootDomainWithoutPort)
        ) {
            // Check if it's actually a subdomain or just www
            const potentialSubdomain = hostParts[0];
            if (potentialSubdomain !== "www") {
                currentHost = potentialSubdomain;
            }
        }
    }

    const session = await getToken({ req, secret: SECRET });
    const userRole = session?.role as string;

    const protocol =
        req.headers.get("x-forwarded-proto") ||
        (process.env.NODE_ENV === "production" ? "https" : "http");
    const isLocalhost = ROOT_DOMAIN.includes("localhost");

    const buildUrl = (subdomain: string, path: string = "") => {
        if (hostname.includes("vercel.app")) {
            const baseVercelDomain = hostname.split(".").slice(-3).join(".");
            return `${protocol}://${subdomain}.${baseVercelDomain}${path}`;
        }

        const domain = isLocalhost
            ? `${subdomain}.${ROOT_DOMAIN}`
            : `${subdomain}.${rootDomainWithoutPort}`;
        return `${protocol}://${domain}${path}`;
    };

    if (currentHost === "hms") {
        if (userRole === "doctor") {
            return NextResponse.redirect(
                new URL(buildUrl("doctor", "/dashboard"), req.url)
            );
        }
        if (userRole === "staff") {
            return NextResponse.redirect(
                new URL(buildUrl("staff", "/dashboard"), req.url)
            );
        }

        return NextResponse.rewrite(
            new URL(`/hms${url.pathname}${url.search}`, req.url)
        );
    }

    if (currentHost === "doctor") {
        // if (!session || userRole !== "DOCTOR") {
        //     return NextResponse.redirect(new URL(hmsUrl, req.url));
        // }
        return NextResponse.rewrite(
            new URL(`/doctor${url.pathname}${url.search}`, req.url)
        );
    }

    if (currentHost === "staff") {
        // if (!session || userRole !== "STAFF") {
        //     return NextResponse.redirect(new URL(hmsUrl, req.url));
        // }
        return NextResponse.rewrite(
            new URL(`/staff${url.pathname}${url.search}`, req.url)
        );
    }

    if (!currentHost) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)",
    ],
};
