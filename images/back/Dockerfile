# Build app
FROM node:20.11.0-alpine

WORKDIR /app

ADD src/back/package.json /app/
RUN npm install && npm cache clean --force

ADD src/back /app
ADD infra/.env-back /app/.env

ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

RUN npx prisma generate && \
    if [ "${APP_ENV}" = "production" ]; then npm run build; fi;

CMD npm run migrate && \
    npm run seed; \
    if [ "${APP_ENV}" = "production" ]; \
    then npm run start:prod; \
    else npm run start:dev; \
    fi;
