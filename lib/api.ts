/**
 * API client utility for making requests to the backend
 * Uses NEXT_PUBLIC_BACKEND_API_URL for client-side requests
 */

/**
 * Get the full API URL for a given endpoint
 * @param endpoint - The API endpoint (e.g., "/auth/login", "/users/me")
 * @returns The full URL to the backend API
 */
export function getApiUrl(endpoint: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

    // Check if we're on the client side
    if (typeof window !== "undefined") {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

        if (backendUrl) {
            // Remove trailing slash from backend URL if present
            const cleanBackendUrl = backendUrl.endsWith("/")
                ? backendUrl.slice(0, -1)
                : backendUrl;

            // Ensure backend URL has protocol (default to https)
            const fullBackendUrl = cleanBackendUrl.startsWith("http")
                ? cleanBackendUrl
                : `https://${cleanBackendUrl}`;

            return `${fullBackendUrl}/${cleanEndpoint}`;
        }
    }

    // Fallback to /api prefix for server-side or when no backend URL is set
    // This will use Next.js rewrites
    return `/api/${cleanEndpoint}`;
}

/**
 * Make an API request with proper URL handling
 * @param endpoint - The API endpoint (e.g., "/auth/login")
 * @param options - Fetch options
 * @returns Promise with the response
 */
export async function apiRequest(
    endpoint: string,
    options?: RequestInit
): Promise<Response> {
    const url = getApiUrl(endpoint);
    return fetch(url, options);
}
