import apiClient from "./client";
import type { MenuCategory } from "@/types/api";

export async function fetchMenuCategories(): Promise<MenuCategory[]> {
    const response = await apiClient.get("menu/categories/")
    return response.data
}