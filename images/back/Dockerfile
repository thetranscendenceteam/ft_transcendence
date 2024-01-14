# Build app
FROM node:20.5.1-alpine as build

ARG NODE_ENV=default
ENV NODE_ENV=${NODE_ENV}

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update \
    	   vim curl bash zsh git postgresql-client dos2unix

ADD src/back /app

WORKDIR /app

RUN npm install && \
    npm run build

EXPOSE 3000

CMD npx prisma migrate deploy; \
	if [ "NODE_ENV" = "production" ]; \
	then npm run start:prod; \
	else npm run start:dev; \
	fi
