/**
 * Utility functions for building subdomain URLs dynamically
 * Works with localhost, Vercel, and custom domains (pulse-clinic.xyz)
 */

/**
 * Get the base domain from the current hostname
 * @returns The base domain (e.g., "pulse-clinic.xyz", "localhost:3000", or "pulse-web-galt.vercel.app")
 */
export function getBaseDomain(): string {
    if (typeof window === "undefined") return "";

    const hostname = window.location.hostname;
    const port = window.location.port;
    const parts = hostname.split(".");

    if (hostname.includes("vercel.app")) {
        // For vercel.app: hms.pulse-web-galt.vercel.app -> pulse-web-galt.vercel.app
        return parts.slice(-3).join(".");
    } else if (hostname.includes("localhost")) {
        // For localhost
        return `localhost${port ? `:${port}` : ""}`;
    } else if (parts.length >= 3) {
        // For custom domains: hms.pulse-clinic.xyz -> pulse-clinic.xyz
        // Remove the first part (subdomain) and keep the rest
        return parts.slice(1).join(".");
    } else {
        // For root domain: pulse-clinic.xyz -> pulse-clinic.xyz
        return hostname;
    }
}

/**
 * Build a URL for a specific subdomain
 * @param subdomain - The subdomain to navigate to (e.g., "staff", "doctor", "hms")
 * @param path - Optional path to append (e.g., "/dashboard", "/login")
 * @returns Full URL (e.g., "https://staff.pulse-clinic.xyz/dashboard")
 */
export function buildSubdomainUrl(subdomain: string, path: string = ""): string {
    if (typeof window === "undefined") return path;

    const protocol = window.location.protocol;
    const baseDomain = getBaseDomain();

    return `${protocol}//${subdomain}.${baseDomain}${path}`;
}

/**
 * Navigate to a specific subdomain
 * @param subdomain - The subdomain to navigate to (e.g., "staff", "doctor", "hms")
 * @param path - Optional path to append (e.g., "/dashboard", "/login")
 */
export function navigateToSubdomain(subdomain: string, path: string = ""): void {
    const url = buildSubdomainUrl(subdomain, path);
    window.location.href = url;
}

/**
 * Get the current subdomain from the hostname
 * @returns The current subdomain or empty string if none
 */
export function getCurrentSubdomain(): string {
    if (typeof window === "undefined") return "";

    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    if (hostname.includes("vercel.app")) {
        // For vercel.app: hms.pulse-web-galt.vercel.app (4 parts = subdomain)
        if (parts.length >= 4) {
            return parts[0];
        }
    } else if (hostname.includes("localhost")) {
        // For localhost: hms.localhost (2 parts = subdomain)
        if (parts.length >= 2) {
            return parts[0];
        }
    } else if (parts.length >= 3) {
        // For custom domains: hms.pulse-clinic.xyz (3 parts = subdomain)
        const potentialSubdomain = parts[0];
        if (potentialSubdomain !== "www") {
            return potentialSubdomain;
        }
    }

    return "";
}
