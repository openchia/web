FROM ubuntu:rolling

# Identify the maintainer of an image
LABEL maintainer="contact@openchia.io"

# Update the image to the latest packages
RUN apt-get update && apt-get upgrade -y

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y curl cron nginx certbot python3-certbot-nginx nodejs npm

EXPOSE 80
EXPOSE 443

WORKDIR /tmp/build
COPY ./ /tmp/build/

RUN npm i
RUN npm run build

RUN mkdir -p /var/www/openchia
RUN cp -a ./dist/static/* /var/www/openchia/

COPY ./nginx/conf.d/ /etc/nginx/conf.d/
COPY ./nginx/sites-enabled/ /etc/nginx/sites-enabled/
COPY ./nginx/snippets/ /etc/nginx/snippets/
COPY ./docker/entrypoint.sh /root/

CMD ["bash", "/root/entrypoint.sh"]
