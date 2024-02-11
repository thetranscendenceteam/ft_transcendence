# Build app
FROM node:20.11.0-alpine

WORKDIR /app

ADD src/front/package.json /app/
RUN npm install && npm cache clean --force

ADD src/front/ /app/
ADD infra/.env-front /app/.env.local
RUN npm run build

ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

CMD if [ "${APP_ENV}" = "production" ]; \
    then npm run start; \
    else npm run dev; \
    fi;
