## Tips to use prisma
NOTE: Prisma only regconize environment file by .env. Before doing migration, remame .env.development or .env.production file to .env for which db from the environment you would like to apply migration. 

Step 1 - Create + apply migration
```bash
npx prisma migrate dev --name name_of_migration
```
Step 2 - Push schema (no migration)
```bash
npx prisma db push
```
Step 3 - Generate client
```bash
npx prisma generate
```
Step 4 - Apply migration files to a database.
```bash
npx prisma migrate deploy
```

## Best practice for production
Drop database (if needed)
```bash
npx prisma migrate reset
```
Versioned, reversible migrations
```bash
npx prisma migrate dev 
```
Prototyping only or on non-critical dev databases
```bash
db push
```
Generate the migration file but NOT apply it
```bash
npx prisma migrate dev --create-only --name your_migration_name
```
List migration history
```bash
npx prisma migrate status
```
