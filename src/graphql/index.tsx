// src/graphql/index.tsx
import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export const SINGLE_UPLOAD = gql`
  mutation SingleUpload($input: SingleFileInput!) {
    singleUpload(input: $input)
  }
`;

export const CREATE_WORK_EXPERIENCE = gql`
  mutation CreateWorkExperience($input: CreateWorkExperienceInput!) {
    createWorkExperience(input: $input) {
      id
    }
  }
`;

