## Getting Started
First, install node modules:
```bash
npm install
```
Second, prepare .env.development and .env.production files which contain needed variables to run the app regarding to environment. 
You can also use only one .env file rather than multiple environments. 
```bash
# NODE ENV
NODE_ENV='environment_name' (eg: development, or production)

# PORT
PORT='4000'

# REDIS_URL
REDIS_URL='your_redis_server' (eg: redis://localhost:6379)

# Auth access
JWT_SECRET='your_jwt_token' (eg: dmasdxxxxxxxxxxxxadasdxxxxxxxxxxxxxxxxx)

# PostgreSQL DB access
DATABASE_URL="your_db_url" (eg: postgresql://postgres:your_hostname:port/postgres?schema=public)

# AWS S3 access, get these info from your aws s3 buckets
AWS_ACCESS_KEY_ID='s3_access_key' 
AWS_SECRET_ACCESS_KEY='s3_secret_key'
AWS_REGION='aws_region'
AWS_S3_BUCKET_NAME='your_s3_bucket_name'
```
Third, run the server:
* Option 1 - Run development server:
```bash
npm run dev
```
* Option 2 - Run production server:
```bash
npm run prod
```

Open http://localhost:4000/graphql with your browser to see the result.

## Deploy the backend server on Railway
The tutorial how to deploy backend server (GraphQL, postgreSQL, redis) all in one on railway.
- [Use Railway platform](https://railway.com/)
- Result: http://thy-khuu-porfolio-production.up.railway.app (this is the plugin to your frontend)

