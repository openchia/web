#!/bin/bash

if [ -z "${CERTBOT_EMAIL}" ]; then
	echo "CERTBOT_EMAIL required"
	exit 1
fi

if [ -z "${DOMAIN_LIST}" ]; then
	echo "DOMAIN_LIST required"
	exit 1
fi

sed -i s/%%API_HOSTNAME%%/${API_HOSTNAME}/g /etc/nginx/sites-enabled/*
sed -i s/%%POOL_HOSTNAME%%/${POOL_HOSTNAME}/g /etc/nginx/sites-enabled/*

certbot --agree-tos register --eff-email -m "${CERTBOT_EMAIL}"

echo ${DOMAIN_LIST} | while read r; do
	certpath="/etc/letsencrypt/live/${r}-0001"
	mkdir -p ${certpath}
	if [ ! -f "${certpath}/fullchain.pem" ]; then
		openssl req -x509 -nodes -newkey rsa:4096 -days 1 -keyout "${certpath}/privkey.pem" -out "${certpath}/fullchain.pem" -subj "/CN=localhost"
		cp "${certpath}/fullchain.pem" "${certpath}/chain.pem"
	fi
	if [ ! -f "/etc/letsencrypt/dhparams.pem" ]; then
		curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "/etc/letsencrypt/ssl-dhparams.pem"
	fi
done

echo "PATH=/bin:/sbin:/usr/sbin:/usr/bin" > /etc/cron.d/certbot-renew
echo "@monthly certbot renew --nginx >> /var/log/cron.log 2>&1" >> /etc/cron.d/certbot-renew

cron

exec nginx -g "daemon off;"
