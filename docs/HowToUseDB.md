# How to use prisma / postgresql

## Prisma

### Prisma Migration

Prisma is a powerful ORM that enable us to bring modification to our schema by using migrations to keep an history of changes (kind of how git works)

That said, if you do modification inside of the *schema.prisma* file, you're gonna need some commands.

Once your **Containers** are up and running, attach to ```ft_transcendence-back``` container.

There, you will start with : 
```sh
npx prisma migrate dev --name "migration_name"
```
Example if you've added a new table named "Student" : 
```sh
npx prisma migrate dev --name "addedNewTableStudent"
```

Depending on the modifications, prisma will ask you to validate the changes.
If everything goes well, you should see a new directory inside ```/src/back/prisma/migrations/``` which name should be ```"timestamp + migration_name"```.

In this directory you'll find a SQL script that Prisma auto-generated based on the modification you've done to the ```schema.prisma``` file.

### Prisma seeding

Prisma gives us a way to auto-fill our database by using a ```.ts``` file. For us, it's ```/src/back/prisma/seed.ts```.

To start it, you'll have to attach to the back container again, as already mentionned in the migration step.

The command : 
```sh
npx prisma db seed
```

From this point on, the database is up and running and is filled with the preconstructed rows define in the ```seed.ts``` file.
Have fun :)

## postgresql

If you ever have the need to directly connect to the postgresql database. Here are some quick way to access it :

### Connect to postgresql

When attached to the container, run :
```sh
psql -d "db_name" -U "username"
```
This will connect you to the postgre database.
As of now, "db_name" is *mydb* and "username" is *johndoe* but this could change /!\

### Doing some easy query

When connected to the postgre DB, you can do some easy SQL queries like
```sql
SELECT * FROM "Users";
```
Note : When using keyword that contains upper-case, you need to put them between quotes

### QOL

The command ```\td``` show you all the tables.