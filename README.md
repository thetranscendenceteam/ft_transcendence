# ft_transcendence

## What's in this repo ?

```
.
├── images
│   ├── back
│   │   └── Dockerfile
│   └── front
│       ├── Dockerfile
│       └── nginx.conf
├── infra
│   └── docker-compose.yaml
├── README.md
└── src
    ├── back
    │   ├── dist
    │   ├── nest-cli.json
    │   ├── node_modules
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── README.md
    │   ├── src
    │   ├── test
    │   ├── tsconfig.build.json
    │   └── tsconfig.json
    └── front
        ├── node_modules
        ├── package.json
        ├── package-lock.json
        ├── public
        ├── README.md
        ├── src
        └── tsconfig.json
```

## Dev environment

### Setup

TODO

### Run

#### Front

TODO

#### Back

TODO

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
