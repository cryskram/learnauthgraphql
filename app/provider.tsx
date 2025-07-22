"use client";

import client from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
        {children}
      </ApolloProvider>
    </SessionProvider>
  );
}
