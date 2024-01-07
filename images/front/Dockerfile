# Build app
FROM node:20.5.1-alpine as build

ADD src/front /app

RUN cd /app \
	&& npm install \
	&& npm run build

# Create image
FROM nginx:1.25.2-alpine-slim

ADD images/front/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.next/ /usr/share/nginx/html

EXPOSE 8080
