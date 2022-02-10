FROM node:16-bullseye as node

RUN mkdir -p /tmp/build
WORKDIR /tmp/build
COPY ./ /tmp/build/

RUN npm i
RUN npm run build

RUN ls -l /tmp/build/dist
RUN ls -l /tmp/build/dist/openchia/

FROM caddy:2.4.6-alpine

EXPOSE 80
EXPOSE 443

# Identify the maintainer of an image
LABEL maintainer="contact@openchia.io"

WORKDIR /root

RUN mkdir -p /var/www/openchia

COPY --from=node /tmp/build/dist/openchia/ /var/www/openchia/
COPY ./caddy/Caddyfile /etc/

CMD ["caddy", "run", "-config", "/etc/Caddyfile"]
