// src/app/experience/page.tsx
'use client';

import SharedModalPageController from '@/components/sharedDashboard/SharedModalPageController';
import {
  GET_WORK_EXPERIENCES,
  DELETE_WORK_EXPERIENCE,
  CREATE_WORK_EXPERIENCE,
  EDIT_WORK_EXPERIENCE,
  SINGLE_UPLOAD,
  DELETE_FILE_FROM_S3,
} from '@/graphql';

export default function ExperiencePage() {
  return (
    <SharedModalPageController
      // GraphQL queries and mutations
      query={GET_WORK_EXPERIENCES}
      deleteMutation={DELETE_WORK_EXPERIENCE}
      createMutation={CREATE_WORK_EXPERIENCE}
      editMutation={EDIT_WORK_EXPERIENCE}
      uploadMutation={SINGLE_UPLOAD}
      deleteFileMutation={DELETE_FILE_FROM_S3}

      // Page title and data key
      pageTitle="Work Experience"
      dataKey="getWorkExperiences"

      // Text fields for displaying data
      textFields={{
        title: 'title',
        subtitle: 'company',
        description: 'description',
        tags: 'skills',
        start: 'startDate',
        end: 'endDate',
      }}

      // File fields for uploading files
      formTitle={{ add: 'Add Experience', edit: 'Edit Experience' }}

      // Form fields for the modal
      formFields={[
        { name: 'title', type: 'text', label: 'Title', required: true },
        { name: 'company', type: 'text', label: 'Company', required: true },
        { name: 'type', type: 'text', label: 'Type' },
        { name: 'startDate', type: 'date', label: 'Start Date', required: true },
        { name: 'endDate', type: 'date', label: 'End Date' },
        { name: 'skills', type: 'text', label: 'Skills (comma-separated)' },
        { name: 'description', type: 'textarea', label: 'Description' },
      ]}  

      // File fields for uploading files
      fileFields={[
        { name: 'contractFileUrl', label: 'Contract File', mode: 'singleupload' },
        { name: 'feedbackFileUrl', label: 'Reference File', mode: 'singleupload' },
        { name: 'demoFileUrl', label: 'Demo File', mode: 'singleupload' },
      ]}
    />
  );
}
