export const BASE_URL = process.env.NEXT_PUBLIC_MY_API_BASE_URL;

// Dashboard page
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

    if (!res.ok) throw new Error("Failed to fetch dashboard page data");

    return res.json();
}


// Transactions page
export interface TransactionsData {
    categories: Category[];
    transactions: Transaction[];
}

export interface Category {
    id: number;
    name: string;
    color: string;
}

export interface Transaction {
    id: number;
    date: string;
    merchant: string;
    original_name: string;
    category: string;
    amount: number;
    bank_name: string;
    account_type: string;
    mask: string;
}

export async function fetchTransactions(): Promise<TransactionsData> {
    const res = await fetch(`${BASE_URL}/db-get-transactions-page-data`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch transactions page data");

    return res.json();
}

// Categories page
export interface CategoriesData {
    gen_catogories: Category[];
    cus_catogories: Category[];
}

export async function fetchCategories(): Promise<CategoriesData> {
    const res = await fetch(`${BASE_URL}/db-get-categories-page-data`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch categories page data");

    return res.json();
} 