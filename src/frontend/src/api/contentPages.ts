import apiClient from "./client";
import type { ContentPageResponse } from "@/types/api";

export async function fetchContentPage(page: string): Promise<ContentPageResponse> {
    const response = await apiClient.get(`pages/${page}/`)
    return response.data
}