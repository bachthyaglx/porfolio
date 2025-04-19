## Tips to use prisma
Create + apply migration
```bash
npx prisma migrate dev --name name_of_migration
```
Push schema (no migration)
```bash
npx prisma db push
```
Generate client
```bash
npx prisma generate
```
Drop database
```bash
npx prisma migrate reset
```

## Best practice for production
Versioned, reversible migrations
```bash
npx prisma migrate dev 
```
Prototyping only or on non-critical dev databases
```bash
db push
```
