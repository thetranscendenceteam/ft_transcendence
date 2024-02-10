# Build app
FROM node:20.11.0-alpine

ARG NODE_ENV=default
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

ADD src/back /app

RUN npm install \
	npm run build

EXPOSE 3000

CMD npx prisma generate && \
	npm run migrate && \
	npm run seed; \
	if [ "NODE_ENV" = "production" ]; \
	then npm run start:prod; \
	else npm run start:dev; \
	fi;
