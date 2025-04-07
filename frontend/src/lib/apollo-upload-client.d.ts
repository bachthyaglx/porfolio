// src/lib/apollo-upload-client.d.ts
declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client';
  interface Options {
    uri?: string;
    credentials?: string;
    headers?: Record<string, string>;
  }
  export function createUploadLink(options: Options): ApolloLink;
}
