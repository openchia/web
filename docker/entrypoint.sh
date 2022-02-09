#!/bin/bash
set -x

if [ -z "${CERTBOT_EMAIL}" ]; then
	echo "CERTBOT_EMAIL required"
	exit 1
fi

if [ -n "${TLS_CERT}" -a -n "${TLS_KEY}" ]; then
	sed -i "s,%%TLS%%,tls ${TLS_CERT} ${TLS_KEY},g" /etc/Caddyfile
else
	sed -i s,%%TLS%%,,g /etc/Caddyfile
fi

sed -i s,%%WWW_DOMAIN%%,${WWW_DOMAIN},g /etc/Caddyfile
sed -i s,%%POOL_DOMAIN%%,${POOL_DOMAIN},g /etc/Caddyfile
sed -i s,%%REDIRECT_DOMAIN%%,${REDIRECT_DOMAIN},g /etc/Caddyfile
sed -i s,%%API_HOSTNAME%%,${API_HOSTNAME},g /etc/Caddyfile
sed -i s,%%POOL_HOSTNAME%%,${POOL_HOSTNAME},g /etc/Caddyfile

exec caddy run --config /etc/Caddyfile
