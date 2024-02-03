FROM nginx:alpine-slim

RUN apk add --no-cache openssl
ADD images/nginx/conf.d /etc/nginx/conf.d
ADD images/nginx/entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]
