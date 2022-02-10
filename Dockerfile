FROM caddy:2.4.6-alpine as caddyimage
FROM ubuntu:rolling

# Identify the maintainer of an image
LABEL maintainer="contact@openchia.io"

# Update the image to the latest packages
RUN apt-get update && apt-get upgrade -y

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs npm

EXPOSE 80
EXPOSE 443

WORKDIR /tmp/build
COPY ./ /tmp/build/

RUN npm i
RUN npm run build

RUN mkdir -p /var/www/openchia
RUN cp -a ./dist/openchia/* /var/www/openchia/

WORKDIR /root

RUN rm -rf /tmp/build

COPY ./caddy/Caddyfile /etc/
COPY --from=caddyimage /usr/bin/caddy /usr/bin/caddy

CMD ["caddy", "run", "-config", "/etc/Caddyfile"]
