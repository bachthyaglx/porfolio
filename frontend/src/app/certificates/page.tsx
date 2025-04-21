// src/app/certificates/page.tsx
'use client';

import SharedModalPageController from '@/components/sharedDashboard/SharedModalPageController';
import {
  GET_CERTIFICATES,
  DELETE_CERTIFICATE,
  CREATE_CERTIFICATE,
  EDIT_CERTIFICATE,
  MULTI_UPLOAD,
  DELETE_FILE_FROM_S3,
} from '@/graphql';

export default function ExperiencePage() {
  return (
    <SharedModalPageController
      // GraphQL queries and mutations
      query={GET_CERTIFICATES}
      deleteMutation={DELETE_CERTIFICATE}
      createMutation={CREATE_CERTIFICATE}
      editMutation={EDIT_CERTIFICATE}
      uploadMutation={MULTI_UPLOAD}
      deleteFileMutation={DELETE_FILE_FROM_S3}

      // Page title and data key
      pageTitle="Certificates"
      dataKey="getCertificates"

      // Text fields for displaying data
      textFields={{
        title: 'title',
        subtitle: 'organization',
        description: 'description',
        tags: 'skills',
        end: 'dateAchieved',
      }}

      // File fields for uploading files
      formTitle={{ add: 'Add Certificate', edit: 'Edit Certificate' }}

      // Form fields for the modal
      formFields={[
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'organization', type: 'text', label: 'Organization', required: true },
        { name: 'skills', type: 'text', label: 'Skills', required: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true },
        { name: 'dateAchieved', type: 'date', label: 'Date ended' },
      ]}      

      // File fields for uploading files
      fileFields={[
        { name: 'certificateFileUrl', label: 'Certificate', mode: 'multiupload' },
      ]}
    />
  );
}
