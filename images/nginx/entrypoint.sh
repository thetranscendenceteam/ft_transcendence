#!/bin/sh

mkdir -p /etc/nginx/ssl
if [ ! -f /etc/nginx/ssl/nginx.key ]; then
  openssl req -x509 -newkey rsa:4096 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt -sha256 -days 3650 -nodes \
    -subj "/C=CH/ST=Vaud/L=Lausanne/O=42/OU=thetranscendenceteam/CN=${DOMAIN_NAME}"
fi

sed -i -e "s/server_name localhost/server_name test/g" /etc/nginx/conf.d/*.conf

exec nginx -g 'daemon off;'
