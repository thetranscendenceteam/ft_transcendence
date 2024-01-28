# Build app
FROM node:20.11.0-alpine

WORKDIR /app

ADD src/front /app

RUN cd /app \
	&& npm install \
	&& npm run build

CMD ["npm", "run", "start"]
