# Build app
FROM node:20.5.1-alpine as build

ADD src/back /app

WORKDIR /app

RUN npm install \
	&& npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
