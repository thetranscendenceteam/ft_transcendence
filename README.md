# ft_transcendence

## What's in this repo ?

```
.
├── README.md
├── docs
│   └── HowToUseDB.md
├── images
│   ├── back
│   │   └── Dockerfile
│   └── front
│       ├── Dockerfile
│       └── nginx.conf
├── infra
│   ├── .env-back
│   ├── .env-front
│   ├── .env-postgres
│   ├── docker-compose.prod.yaml
│   └── docker-compose.yaml
├── package-lock.json
├── package.json
└── src
    ├── back
    │   ├── README.md
    │   ├── dist
    │   ├── nest-cli.json
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── prisma
    │   ├── src
    │   ├── test
    │   ├── tsconfig.build.json
    │   └── tsconfig.json
    └── front
        ├── README.md
        ├── components.json
        ├── env.local
        ├── package-lock.json
        ├── package.json
        ├── public
        ├── src
        └── tsconfig.json
```

## Dev environment

### Setup

This project use the latest version of node v20.x.x, you can found it here : https://nodejs.org/en

Once you have `node` installed, you should also have some utilities that comes with it like `npm`.

To downloadthe dependencies, while in the front/back directory you can execute this command :

```sh
npm install
```

### Run

#### Front

To start the front in dev mode, just run :

```sh
npm start
```

#### Back

To start the front in dev mode, just run :

```sh
npm run start
```

#### Initialize Database

Before following thoses guidelines, be sure to run the project with the corrects commands : [goto](#docker-compose)

[Guide for Prisma](./docs/HowToUseDB.md##prisma)

#### Use adminer

Adminer is a easy database managment tool that you can use inside your internet browser.
If you're using VSCode's Docker extension, you'll see it in the list of running containers once you've started the project.

Right click on it and choose "Open in browser" or just go to "http://localhost:8080"

To login :
```
System : PostgreSQL
Server: postgres
Username: "POSTGRES_USER" right now it's johndoe
Password: "POSTGRES_PASSWORD" right now it's randompassword
Database: "POSTGRES_DB" right now it's mydb
```

## Docker images

### Front image

#### Build

To build the front image, you must be at the ROOT of the projet.

```sh
docker build -f images/front/Dockerfile -t ghcr.io/thetranscendenceteam/front:latest .
```

This will build the front image and set the correct tag used by the docker-compose file.

#### How it works

The front image is first build with node and then the static build is copied on a nginx image.

This make sure that we have a minimal production-ready image.

By running the following command , you will be able to reach the front with `https://localhost:8080` :

```sh
docker run -it --rm -n transcendence/front -p 8080:8080 ghcr.io/thetranscendenceteam/front:latest
```

### Back image

#### Build

To build the back image, you must be at the ROOT of the projet.

```sh
docker build -f images/back/Dockerfile -t ghcr.io/thetranscendenceteam/back:latest .
```

This will build the front image and set the correct tag used by the docker-compose file.

#### How it works

The back image is based on node, it will simply install dependencies and start the server..

By running the following command , you will be able to reach the back with `https://localhost:3000` :

```sh
docker run -it --rm -n transcendence/front -p 3000:3000 ghcr.io/thetranscendenceteam/back:latest
```

## Docker compose

### How to run

If you wanna build all of the project at once, and not a particular image, this command
allow you to directly setup everything :

```sh
docker compose -f ./infra/docker-compose.yaml -p ft_transcendence up -d --build
```

Notice : The ```--build``` argument is optional and you can remove it if you don't need it, but it's strongly advised to use it at least the first time you're launching the project.

### How to shut it down

Pretty basics, just replace the ```up``` argument :
```sh
docker compose -f ./infra/docker-compose.yaml -p ft_transcendence down
```
