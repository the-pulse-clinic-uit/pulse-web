import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "localhost:3000";
const SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host");

    const currentHost = hostname
        ?.replace(`.${ROOT_DOMAIN}`, "")
        .replace(ROOT_DOMAIN, "");

    const session = await getToken({ req, secret: SECRET });
    const userRole = session?.role as string;

    const hmsUrl = `http://hms.${ROOT_DOMAIN}`;

    if (currentHost === "hms") {
        if (userRole === "DOCTOR") {
            return NextResponse.redirect(
                new URL(`http://doctor.${ROOT_DOMAIN}/dashboard`, req.url)
            );
        }
        if (userRole === "STAFF") {
            return NextResponse.redirect(
                new URL(`http://staff.${ROOT_DOMAIN}/dashboard`, req.url)
            );
        }

        return NextResponse.rewrite(new URL(`/hms${url.pathname}`, req.url));
    }

    if (currentHost === "doctor") {
        if (!session || userRole !== "DOCTOR") {
            return NextResponse.redirect(new URL(hmsUrl, req.url));
        }
        return NextResponse.rewrite(new URL(`/doctor${url.pathname}`, req.url));
    }

    if (currentHost === "staff") {
        // if (!session || userRole !== "STAFF") {
        //     return NextResponse.redirect(new URL(hmsUrl, req.url));
        // }
        return NextResponse.rewrite(new URL(`/staff${url.pathname}`, req.url));
    }

    if (!currentHost || currentHost === "www" || currentHost === ROOT_DOMAIN) {
        return NextResponse.rewrite(new URL(`/site${url.pathname}`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)",
    ],
};
