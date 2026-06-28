import apiClient from "./client";
import type { SiteImages } from "@/types/api";

export async function fetchImages(): Promise<SiteImages> {
    const response = await apiClient.get("/site-images/")
    return response.data
}