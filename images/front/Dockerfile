# Build app
FROM node:20.11.0-alpine

ARG NODE_ENV=default
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

ADD src/front /app

RUN cd /app \
	&& npm install \
	&& npm run build

CMD if [ "NODE_ENV" = "production" ]; \
	then npm run start; \
	else npm run dev; \
	fi;
