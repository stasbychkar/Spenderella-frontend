const BASE_URL = process.env.NEXT_PUBLIC_MY_API_BASE_URL;

export interface DashboardData {
    total_spent: number;
    linked_banks: Bank[];
    transactions: Transaction[];
    spending_by_category: CategorySpend[];
}

export interface Bank {
    id: number;
    name: string;
    lastFour: string;
    accountType: string;
}

export interface Transaction {
    id: number;
    date: string;
    merchant: string;
    category: string;
    amount: number;
}

export interface CategorySpend {
    name: string;
    value: number;
    color: string;
}

export async function fetchDashboard(): Promise<DashboardData> {
    const res = await fetch(`${BASE_URL}/db-get-dashboard-page-data`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch dashboard data");

    return res.json();
}