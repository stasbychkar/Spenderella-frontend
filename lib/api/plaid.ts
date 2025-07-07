    const BASE_URL = process.env.NEXT_PUBLIC_MY_API_BASE_URL;
    console.log("BASE_URL from env:", BASE_URL);

    export async function createLinkToken(): Promise<{ link_token: string }> {
        const res = await fetch(`${BASE_URL}/link-token`);
        if (!res.ok) throw new Error("Failed to fetch link token");
        return res.json();
    }

    export async function exchangePublicToken(
        publicToken: string,
        institutionName: string
    ): Promise<any> {
        const res = await fetch(`${BASE_URL}/exchange-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                public_token: publicToken,
                institution_name: institutionName || "Unknown Bank",
            }),      
        });

        if (!res.ok) throw new Error("Failed to exchange public token");
        return res.json();
    }
    