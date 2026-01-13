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

    // For Vercel deployments like "pulse-web-galt.vercel.app"
    // we want to treat the main domain as "root" and any prefix before it as subdomain
    if (hostParts.length >= 2) {
        // Check if it's a Vercel domain
        if (hostname.includes("vercel.app")) {
            // For vercel.app: hms.pulse-web-galt.vercel.app
            // Extract first part only if there are 4+ parts
            if (hostParts.length >= 4) {
                currentHost = hostParts[0];
            }
        } else if (hostname.includes(rootDomainWithoutPort)) {
            // For custom domains: subdomain.yourdomain.com
            const rootParts = rootDomainWithoutPort.split(".");
            if (hostParts.length > rootParts.length) {
                currentHost = hostParts[0];
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
        // For Vercel deployments
        if (hostname.includes("vercel.app")) {
            const baseVercelDomain = hostname.split(".").slice(-3).join(".");
            return `${protocol}://${subdomain}.${baseVercelDomain}${path}`;
        }

        // For custom domains and localhost
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

    // If no subdomain is detected, this is the root domain - serve patient portal
    // The patient portal is in the (site) folder, which Next.js serves at the root
    // So we just let it pass through naturally
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
