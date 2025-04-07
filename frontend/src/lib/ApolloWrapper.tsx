// src/lib/ApolloWrapper.tsx
'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

// ✅ Must use NEXT_PUBLIC_ variables on the client
const apiEnv = process.env.NEXT_PUBLIC_API_ENV;

const uri =
  apiEnv === 'prod'
    ? process.env.NEXT_PUBLIC_PROD_GRAPHQL_URL
    : process.env.NEXT_PUBLIC_DEV_GRAPHQL_URL;

console.log('🌐 API ENV:', apiEnv);
console.log('🔗 GraphQL URL:', uri);

const authLink = setContext((_, { headers }) => {
  // ⚠️ Avoid ReferenceError: localStorage is not defined
  const token = typeof window !== 'undefined' ? localStorage.getItem("app-user-token") : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'apollo-require-preflight': 'true',
    },
  };
});

const httpLink = createUploadLink({ uri });

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
