"use client";

import { useEffect } from "react";
import { installFetchWrapper } from "@/lib/fetch-wrapper";

/**
 * Client component that installs the global fetch wrapper
 * This ensures all fetch calls to /api/* are redirected to the backend
 */
export default function FetchWrapperProvider() {
    useEffect(() => {
        installFetchWrapper();
    }, []);

    return null;
}
