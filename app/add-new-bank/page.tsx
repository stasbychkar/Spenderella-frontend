"use client";

import { useEffect } from 'react';
import { createLinkToken, exchangePublicToken } from '@/lib/api/plaid';

export default function PlaidLinkPage() {
    useEffect(() => {
      async function initPlaid() {
        try {
          const { link_token } = await createLinkToken();
  
          const handler = (window as any).Plaid.create({
            token: link_token,
            onSuccess: async (public_token: string, metadata: any) => {
              console.log("Public token received:", public_token);
  
              try {
                const result = await exchangePublicToken(
                  public_token,
                  metadata.institution?.name
                );
                console.log("Exchange token result:", result);
              } catch (err) {
                console.error("Error exchanging token:", err);
              }
            },
          });
  
          const btn = document.getElementById("link-button");
          if (btn) {
            btn.onclick = () => handler.open();
          }
        } catch (err) {
          console.error("Error creating Plaid link token:", err);
        }
      }
  
      initPlaid();
    }, []);
  
    return (
      <div>
        <button id="link-button">
          Connect with Plaid
        </button>
      </div>
    );
  }
  