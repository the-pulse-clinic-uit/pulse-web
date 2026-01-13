import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "qasczjzmpolxwphsvqyp.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },

    async rewrites() {
        const backendUrl =
            process.env.BACKEND_API_URL || "http://localhost:8080";

        const destination = backendUrl.startsWith("http")
            ? backendUrl
            : `https://${backendUrl}`;

        return [
            {
                source: "/api/:path*",
                destination: `${destination}/:path*`,
            },
        ];
    },
};

export default nextConfig;
