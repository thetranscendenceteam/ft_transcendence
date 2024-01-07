# Build app
FROM node:20.5.1-alpine as build

RUN apk update && apk upgrade \
    && apk add --no-cache --quiet --update \
    	   vim curl bash zsh git postgresql-client dos2unix

ADD src/back /app

WORKDIR /app

RUN npm install \
	&& npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
