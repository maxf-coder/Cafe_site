import apiClient from "./client";
import type { SiteSettings } from "@/types/api";

export async function fetchSettings(): Promise<SiteSettings> {
    const response = await apiClient.get("settings/")
    return response.data
}