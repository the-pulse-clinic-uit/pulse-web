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
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8080/:path*",
            },
        ];
    },
};

export default nextConfig;
