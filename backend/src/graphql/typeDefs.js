// src/graphql/typeDefs.js
import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Upload

  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    id: Int!
    username: String!
  }

  # input SingleFileInput {
  #   file: Upload!
  # }
  
  input CreateWorkExperienceInput {
    title: String!
    company: String!
    type: String!
    startDate: String!
    endDate: String
    skills: [String!]!
    description: String!
    contractFileUrl: String
    feedbackFileUrl: String
    demoFileUrl: String
  }
  
  input CreateCertificateInput {
    title: String!
    organization: String!
    skills: [String!]!
    description: String!
    dateAchieved: String!
    certificateFileUrl: [String!]!
  }

  input CreateEducationInput {
    degree: String!
    program: String!
    school: String!
    skills: [String!]!
    description: String!
    startDate: String!
    endDate: String
    degreeFileUrl: String
    transcriptFileUrl: String
    enrollmentFileUrl: String
  }

  input CreateProjectInput {
    title: String!
    skills: [String!]!
    description: String!
    category: String!
    projectUrl: String
  }

  type WorkExperience {
    id: String!
    title: String!
    company: String!
    type: String!
    startDate: String!
    endDate: String!
    skills: [String!]!
    description: String!
    contractFileUrl: String
    feedbackFileUrl: String
    demoFileUrl: String
    createdAt: String!
  }

  type Certificate {
    id: String!
    title: String!
    organization: String!
    skills: [String!]!
    description: String!
    dateAchieved: String!
    certificateFileUrl: [String!]!
    createdAt: String!
  }

  type Education {
    id: String!
    degree: String!
    program: String!
    school: String!
    skills: [String!]!
    description: String!
    startDate: String!
    endDate: String
    degreeFileUrl: String
    transcriptFileUrl: String
    enrollmentFileUrl: String
    createdAt: String!
  }

  type Project {
    id: String!
    title: String!
    skills: [String!]!
    description: String!
    projectUrl: String
    category: String!
    createdAt: String!
  }

  type Query {
    me: User
    # getFiles(userId: String!): [String!]
    getWorkExperiences: [WorkExperience!]!
    getProjects: [Project!]!
    getCertificates: [Certificate!]!
    getEducations: [Education!]!
  }

  type Mutation {
    signup(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!

    singleUpload(file: Upload!): String!
    multiUpload(files: [Upload!]!): [String!]!

    singleDelete(fileUrl: String!): Boolean!

    createWorkExperience(input: CreateWorkExperienceInput!): WorkExperience!
    createCertificate(input: CreateCertificateInput!): Certificate!
    createProject(input: CreateProjectInput!): Project!
    createEducation(input: CreateEducationInput!): Education!

    editWorkExperience(id: String!, input: CreateWorkExperienceInput!): WorkExperience!
    editCertificate(id: String!, input: CreateCertificateInput!): Certificate!
    editProject(id: String!, input: CreateProjectInput!): Project!
    editEducation(id: String!, input: CreateEducationInput!): Education!

    deleteWorkExperience(id: String!): Boolean!
    deleteCertificate(id: String!): Boolean!
    deleteProject(id: String!): Boolean!
    deleteEducation(id: String!): Boolean!
  }
`;
