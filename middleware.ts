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

    if (hostWithoutPort.includes(".")) {
        const subdomain = hostWithoutPort.split(".")[0];

        if (
            !hostWithoutPort.endsWith(rootDomainWithoutPort) ||
            hostWithoutPort !== rootDomainWithoutPort
        ) {
            currentHost = subdomain;
        }
    }

    const session = await getToken({ req, secret: SECRET });
    const userRole = session?.role as string;

    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const isLocalhost = ROOT_DOMAIN.includes("localhost");

    const buildUrl = (subdomain: string, path: string = "") => {
        const domain = isLocalhost
            ? `${subdomain}.${ROOT_DOMAIN}`
            : `${subdomain}.${rootDomainWithoutPort}`;
        return `${protocol}://${domain}${path}`;
    };

    const hmsUrl = buildUrl("hms");

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

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)",
    ],
};
