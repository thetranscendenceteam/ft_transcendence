# Build app
FROM node:20.11.0-alpine

WORKDIR /app

RUN apk add --no-cache curl

ADD src/front/package.json /app/
RUN npm install && npm cache clean --force

ADD src/front/ /app/
ADD infra/.env-front /app/.env.local

ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

RUN if [ "${APP_ENV}" = "production" ]; then npm run build; fi;

CMD if [ "${APP_ENV}" = "production" ]; \
    then npm run start; \
    else npm run dev; \
    fi;
