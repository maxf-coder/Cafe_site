import apiClient from "./client";
import type { SiteSettings } from "@/types/api";

export async function fetchSettigs(): Promise<SiteSettings> {
    const response = await apiClient.get("/settings/")
    return response.data
}