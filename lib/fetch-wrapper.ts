import { getApiUrl } from "./api";

const originalFetch = globalThis.fetch;

export const wrappedFetch: typeof fetch = (input, init?) => {
    let url: string;

    if (typeof input === "string") {
        url = input;
    } else if (input instanceof URL) {
        url = input.toString();
    } else if (input instanceof Request) {
        url = input.url;
    } else {
        url = String(input);
    }

    if (url.startsWith("/api/")) {
        const endpoint = url.replace(/^\/api\//, "");
        const backendUrl = getApiUrl(endpoint);

        console.log(`[Fetch Wrapper] Redirecting ${url} -> ${backendUrl}`);

        if (input instanceof Request) {
            return originalFetch(
                new Request(backendUrl, {
                    method: input.method,
                    headers: input.headers,
                    body: input.body,
                    mode: input.mode,
                    credentials: input.credentials,
                    cache: input.cache,
                    redirect: input.redirect,
                    referrer: input.referrer,
                    integrity: input.integrity,
                })
            );
        } else {
            return originalFetch(backendUrl, init);
        }
    }

    return originalFetch(input, init);
};

export function installFetchWrapper() {
    if (typeof window !== "undefined") {
        window.fetch = wrappedFetch;
        console.log("[Fetch Wrapper] Installed global fetch wrapper");
    }
}
