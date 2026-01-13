/**
 * Get the full API URL for a given endpoint
 * @param endpoint - The API endpoint (e.g., "/auth/login", "/users/me")
 * @returns The full URL to the backend API
 */
export function getApiUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint.slice(1)
        : endpoint;

    if (typeof window !== "undefined") {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

        if (backendUrl) {
            const cleanBackendUrl = backendUrl.endsWith("/")
                ? backendUrl.slice(0, -1)
                : backendUrl;

            const fullBackendUrl = cleanBackendUrl.startsWith("http")
                ? cleanBackendUrl
                : `https://${cleanBackendUrl}`;

            return `${fullBackendUrl}/${cleanEndpoint}`;
        }
    }
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
    console.log("API Request to:", url);
    console.log("Backend URL env:", process.env.NEXT_PUBLIC_BACKEND_API_URL);
    return fetch(url, options);
}
