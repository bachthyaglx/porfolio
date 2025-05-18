import fs from 'fs';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`✅ Loaded environment from ${envFile}`);
  } else {
    console.warn(`⚠️ ${envFile} not found, falling back to default .env`);
    dotenv.config();
  }
} else {
  console.log('🌐 Production mode: using Railway-injected environment variables.');
}
