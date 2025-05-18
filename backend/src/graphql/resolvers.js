// src/graphql/resolvers.js
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createToken } from '../auth/jwt.js';
import { requireAuth } from '../utils/requireAuth.js';
import { PrismaClient } from '@prisma/client';
import { GraphQLUpload } from '../shims/graphql-upload.js';
import { listFilesFromS3, uploadFileToS3, deleteFileFromS3 } from '../s3/s3Service.js';
import redis from '../utils/redis.js';

const prisma = new PrismaClient();

export const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    me: async (_, __, context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      return prisma.user.findUnique({ where: { id: context.userId } });
    },

    // getFiles: async (_, { userId }) => {
    //   return listFilesFromS3(userId);
    // },

    getWorkExperiences: async () => {
      const cacheKey = 'work_experiences';
    
      // Check cache first
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`🧠 Redis cache hit: ${cacheKey}!`);
        return JSON.parse(cached);
      }
    
      // If not cached, fetch from DB
      const data = await prisma.workExperience.findMany({
        orderBy: { startDate: 'desc' },
      });
    
      // Cache the result for 1 hour
      await redis.set(cacheKey, JSON.stringify(data), { EX: 3600 });
      console.log(`📦 Redis cache set: ${cacheKey}`);

      return data;
    },

    getProjects: async () => {
      const cacheKey = 'projects';

      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`🧠 Redis cache hit: ${cacheKey}`);
        return JSON.parse(cached);
      }

      const data = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      });

      await redis.set(cacheKey, JSON.stringify(data), { EX: 3600 });
      console.log(`📦 Redis cache set: ${cacheKey}`);

      return data;
    },

    getCertificates: async () => {
      const cacheKey = 'certificates';
    
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`🧠 Redis cache hit: ${cacheKey}`);
        return JSON.parse(cached);
      }
    
      const data = await prisma.certificate.findMany({
        orderBy: { createdAt: 'desc' },
      });
    
      await redis.set(cacheKey, JSON.stringify(data), { EX: 3600 });
      console.log(`📦 Redis cache set: ${cacheKey}`);
    
      return data;
    },

    getEducations: async () => {
      const cacheKey = 'educations';

      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`🧠 Redis cache hit: ${cacheKey}`);
        return JSON.parse(cached);
      }
    
      const data = await prisma.education.findMany({
        orderBy: { createdAt: 'desc' },
      });
    
      await redis.set(cacheKey, JSON.stringify(data), { EX: 3600 });
      console.log(`📦 Redis cache set: ${cacheKey}`);
    
      return data;
    },
  },

  Mutation: {
    signup: async (_, { username, password }) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { username, password: hashed } });
      const token = createToken(user.id);
      return { token, user };
    },

    login: async (_, { username, password }, context) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) throw new Error('User not found');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');

      const newTokenId = uuidv4();
      await prisma.user.update({
        where: { id: user.id },
        data: { tokenId: newTokenId },
      });

      const accessToken = createToken(user.id, newTokenId);
      return { token: accessToken, user };
    },
    
    singleUpload: async (_, { file }, context) => {
      requireAuth(context.userId);

      console.log('📥 singleUpload received file:', file);
      try {
        const url = await uploadFileToS3(context.userId, file);
        return url;
      } catch (err) {
        console.error('❌ Error uploading file:', err);
        throw new Error('Failed to upload file: ' + err.message);
      }
    },

    multiUpload: async (_, { files }, context) => {
      requireAuth(context.userId);
    
      try {
        const urls = await Promise.all(
          files.map((file) => uploadFileToS3(context.userId, file))
        );
        return urls;
      } catch (err) {
        console.error('❌ Error in multiUpload:', err);
        throw new Error('Multi upload failed');
      }
    },
    
    createWorkExperience: async (_, { input }, context) => {
      requireAuth(context.userId);

      console.log('📤 Creating WorkExperience with:', input);
      try {
        const experience = await prisma.workExperience.create({
          data: {
            ...input,
            startDate: input.startDate,
            endDate: input.endDate || null,
            userId: context.userId,
          },
        });

        // 🧹 Clear cache after creating a new entry
        await redis.del('work_experiences');

        return experience;
      } catch(err) {
        console.error('❌ Error creating work experience:', err);
        throw new Error('Failed to create work experience: ' + err.message); 
      }
    },

    createProject: async (_, { input }, context) => {
      requireAuth(context.userId);
      console.log('🎓 Creating Project with:', input);
      try {
        const project = await prisma.project.create({
          data: {
            ...input,
            userId: context.userId,
          },
        });

        // 🧹 Clear cache after creating a new entry
        await redis.del('projects');

        return project;
      } catch (err) {
        console.error('❌ Error creating project:', err);
        throw new Error('Failed to create project: ' + err.message);
      }
    },

    createCertificate: async (_, { input }, context) => {
      requireAuth(context.userId);
      console.log('📄 Creating Certificate with:', input);
      try {
        const certificate = await prisma.certificate.create({
          data: {
            ...input,
            dateAchieved: input.dateAchieved,
            certificateFileUrl: { set: input.certificateFileUrl },
            userId: context.userId,
          },
        });

        // 🧹 Clear cache after creating a new entry
        await redis.del('certificates');

        return certificate;
      } catch(err) {
        console.error('❌ Error creating certificate:', err);
        throw new Error('Failed to create certificate: ' + err.message);        
      }
    },

    createEducation: async (_, { input }, context) => {
      requireAuth(context.userId);
      console.log('🎓 Creating Education with:', input);
      try {
        const education = await prisma.education.create({
          data: {
            ...input,
            startDate: input.startDate,
            endDate: input.endDate || null,
            userId: context.userId,
          },
        });

        // 🧹 Clear cache after creating a new entry
        await redis.del('educations');

        return education;
      } catch (err) {
        console.error('❌ Error creating education:', err);
        throw new Error('Failed to create education: ' + err.message);
      }
    },

    editWorkExperience: async (_, { id, input }, context) => {
      requireAuth(context.userId);
    
      const updated = await prisma.workExperience.update({
        where: { id },
        data: {
          ...input,
          startDate: input.startDate,
          endDate: input.endDate || null,
        },
      });
      
      // 🧹 Clear cache after creating a new entry
      await redis.del('work_experiences');
    
      return updated;
    },

    editProject: async (_, { id, input }, context) => {
      requireAuth(context.userId);

      const updated = await prisma.project.update({ where: { id }, data: input });

      // 🧹 Clear cache after creating a new entry
      await redis.del('projects');

      return updated;
    },

    editCertificate: async (_, { id, input }, context) => {
      requireAuth(context.userId);
    
      const updated = await prisma.certificate.update({
        where: { id },
        data: {
          ...input,
          dateAchieved: input.dateAchieved,
        },
      });
      
      // 🧹 Clear cache after creating a new entry
      await redis.del('certificates'); 
    
      return updated;
    },

    editEducation: async (_, { id, input }, context) => {
      requireAuth(context.userId);
      
      try {
        const updated = await prisma.education.update({
          where: { id },
          data: {
            ...input,
            startDate: input.startDate,
            endDate: input.endDate || null,
          },
        });
    
        // 🧹 Clear cache after creating a new entry
        await redis.del('educations');
    
        return updated;
      } catch (err) {
        console.error('❌ Error editing education:', err);
        throw new Error('Failed to edit education: ' + err.message);
      }
    },    
    
    singleDelete: async (_, { fileUrl }, context) => {
      requireAuth(context.userId);
      try {
        await deleteFileFromS3(fileUrl);
        return true;
      } catch (err) {
        console.error('❌ S3 deletion failed:', err);
        return false;
      }
    },

    deleteWorkExperience: async (_, { id }, context) => {
      requireAuth(context.userId);
    
      const work = await prisma.workExperience.findUnique({ where: { id } });
      if (!work) throw new Error('Not found');
    
      // Delete files from S3 (contractFileUrl)
      if (work.contractFileUrl) {
        await deleteFileFromS3(work.contractFileUrl);
      }

      // Delete files from S3 (feedbackFileUrl)
      if (work.feedbackFileUrl) {
        await deleteFileFromS3(work.feedbackFileUrl);
      }
    
      // Delete files from S3 (feedbackFileUrl)
      if (work.demoFileUrl) {
        await deleteFileFromS3(work.demoFileUrl);
      }

      await prisma.workExperience.delete({ where: { id } });
      
      // 🧹 clear cache
      await redis.del('work_experiences');
    
      return true;
    },
    
    deleteProject: async (_, { id }, context) => {
      requireAuth(context.userId);
      await prisma.project.delete({ where: { id } });
      
      // 🧹 clear cache
      await redis.del('projects');
    
      return true;
    },

    deleteCertificate: async (_, { id }, context) => {
      requireAuth(context.userId);
      const cert = await prisma.certificate.findUnique({ where: { id } });
      if (!cert) throw new Error('Not found');
    
      if (cert?.certificateFileUrl) {
        await deleteFileFromS3(cert.certificateFileUrl);
      }
    
      await prisma.certificate.delete({ where: { id } });

      // 🧹 clear cache
      await redis.del('certificates');
    
      return true;
    },
    
    deleteEducation: async (_, { id }, context) => {
      requireAuth(context.userId);
      const edu = await prisma.education.findUnique({ where: { id } });
    
      if (edu?.degreeFileUrl) {
        await deleteFileFromS3(edu.degreeFileUrl);
      }
      
      if (edu?.transcriptFileUrl) {
        await deleteFileFromS3(edu.transcriptFileUrl);
      }

      if (edu?.enrollmentFileUrl) {
        await deleteFileFromS3(edu.enrollmentFileUrl);
      }

      await prisma.education.delete({ where: { id } });
      
      // 🧹 clear cache
      await redis.del('educations');
    
      return true;
    },    
  },
};
