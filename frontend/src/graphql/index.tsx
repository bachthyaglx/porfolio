// src/graphql/index.tsx
import { gql } from '@apollo/client';

export const GET_WORK_EXPERIENCES = gql`
  query getWorkExperiences {
    getWorkExperiences {
      id
      title
      company
      type
      startDate
      endDate
      skills
      description
      contractFileUrl
      feedbackFileUrl
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      id
      title
      skills
      description
      projectUrl
      createdAt
    }
  }
`;

export const GET_CERTIFICATES = gql`
  query GetCertificates {
    getCertificates {
      id
      title
      organization
      description
      skills
      dateAchieved
      certificateFileUrl
    }
  }
`;

export const GET_EDUCATIONS = gql`
  query {
    getEducations {
      id
      degree
      program
      school
      skills
      description
      startDate
      endDate
      degreeUrl
      createdAt
    }
  }
`;

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

export const MULTI_UPLOAD = gql`
  mutation MultiUpload($input: [Upload!]!) {
    multiUpload(input: $input)
  }
`;

export const CREATE_WORK_EXPERIENCE = gql`
  mutation CreateWorkExperience($input: CreateWorkExperienceInput!) {
    createWorkExperience(input: $input) {
      id
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
      skills
      description
      projectUrl
      createdAt
    }
  }
`;

export const CREATE_CERTIFICATE = gql`
  mutation CreateCertificate($input: CreateCertificateInput!) {
    createCertificate(input: $input) {
      id
      title
      organization
    }
  }
`;

export const CREATE_EDUCATION = gql`
  mutation CreateEducation($input: CreateEducationInput!) {
    createEducation(input: $input) {
      id
      degree
      program
      school
      skills
      description
      startDate
      endDate
      degreeUrl
      createdAt
    }
  }
`;

export const EDIT_WORK_EXPERIENCE = gql`
  mutation EditWorkExperience($id: String!, $input: CreateWorkExperienceInput!) {
    editWorkExperience(id: $id, input: $input) {
      id
    }
  }
`;

export const EDIT_PROJECT = gql`
  mutation EditProject($id: String!, $input: EditProjectInput!) {
    editProject(id: $id, input: $input) {
      id
      title
      skills
      description
      projectUrl
      createdAt
    }
  }
`;

export const EDIT_CERTIFICATE = gql`
  mutation EditCertificate($id: String!, $input: CreateCertificateInput!) {
    editCertificate(id: $id, input: $input) {
      id
      title
    }
  }
`;

export const EDIT_EDUCATION = gql`
  mutation EditEducation($id: String!, $input: CreateEducationInput!) {
    editEducation(id: $id, input: $input) {
      id
      degree
      program
      school
      skills
      description
      startDate
      endDate
      degreeUrl
      createdAt
    }
  }
`;

export const DELETE_FILE_FROM_S3 = gql`
  mutation SingleDelete($fileUrl: String!) {
    singleDelete(fileUrl: $fileUrl)
  }
`;

export const DELETE_WORK_EXPERIENCE = gql`
  mutation DeleteWorkExperience($id: String!) {
    deleteWorkExperience(id: $id)
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id)
  }
`;

export const DELETE_CERTIFICATE = gql`
  mutation DeleteCertificate($id: String!) {
    deleteCertificate(id: $id)
  }
`;

export const DELETE_EDUCATION = gql`
  mutation DeleteEducation($id: String!) {
    deleteEducation(id: $id)
  }
`;