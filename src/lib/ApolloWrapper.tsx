// src/lib/ApolloWrapper.tsx
'use client';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  // ⚠️ Avoid ReferenceError: localStorage is not defined
  const token = typeof window !== 'undefined'
    ? localStorage.getItem("app-user-token")
    : null;

  console.log('📦 Token being used:', token); // Check used token 

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'apollo-require-preflight': 'true',
    },
  };
});

const httpLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
