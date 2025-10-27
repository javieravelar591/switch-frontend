import { API_BASE_URL } from "@/constants/api";

export async function fetchBrands() {
    const response = await fetch(`${API_BASE_URL}/brands`);
    console.log(response);
    if (!response.ok) {
        throw new Error("Failed to fetch brands");
    }
    return response.json();
}