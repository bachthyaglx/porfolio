import fs from 'fs';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log(`✅ Loaded environment from ${envFile}`);
} else {
  console.warn(`⚠️ ${envFile} not found, falling back to default .env`);
  dotenv.config();
}
