## Getting Started
First, install node modules:
```bash
npm install
```
Second, prepare .env.development and .env.production files which contain needed variables to run the app regarding to environment. 
You can also use only one .env file rather than multiple environments. 
```bash
NEXT_PUBLIC_API_ENV=prod
NEXT_PUBLIC_DEV_GRAPHQL_URL='your_local_graphql_server' (eg: http://localhost:4000/graphql)
NEXT_PUBLIC_PROD_GRAPHQL_URL='your_deployed_graphql_server' (eg: https://your-host-name/graphql)
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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel
The tutorial how to deploy next.js app on Vercel
- Option 1: [Use Vercel platform](https://nextjs.org/learn/pages-router/deploying-nextjs-app-deploy)
- Option 2: [Use github action](https://staticmania.com/blog/how-to-deploy-next-js-application-with-github-action) 
- Result: http://thy-khuu-porfolio.vercel.app

## Learn More
To learn more about Next.js, take a look at the following resources:
- [React Foundations](https://nextjs.org/learn/react-foundations)
- [Learn Next.js](https://nextjs.org/learn)
