#!/bin/bash
set -x

if [ -z "${CERTBOT_EMAIL}" ]; then
	echo "CERTBOT_EMAIL required"
	exit 1
fi

certbot --agree-tos register --eff-email -m "${CERTBOT_EMAIL}"

randomstr() {
	tr -dc A-Za-z0-9 </dev/urandom | head -c 8
}

certpath=""
dummy=0
renewal_path="/etc/letsencrypt/renewal/openchia.io.conf"
if [ -f "${renewal_path}" ]; then
	cert=$(cat ${renewal_path} | grep ^cert | awk '{print $3}')
	certpath=$(dirname ${cert})
	if [ ! -f "${cert}" ]; then
		mv ${renewal_path} ${renewal_path}.$(randomstr)
		[ -e "${certpath}" ] && mv ${certpath} "${certpath}.$(randomstr)"
		certpath=""
	fi
fi

if [ -z "${certpath}" ]; then

	basepath="/etc/letsencrypt/live"
	certpath="${basepath}/openchia.io"
	[ -e "${certpath}" ] && mv "${certpath}" "${certpath}.$(randomstr)"
	dummy=1
	[ -e "${certpath}" ] && mv "${certpath}" "${certpath}.$(randomstr)"
	certpath="${basepath}/dummy"
	mkdir -p $certpath
	openssl req -x509 -nodes -newkey rsa:4096 -days 1 -keyout "${certpath}/privkey.pem" -out "${certpath}/fullchain.pem" -subj "/CN=localhost"
	cp "${certpath}/fullchain.pem" "${certpath}/chain.pem"

fi

sed -i s,%%CERTPATH%%,${certpath},g /etc/nginx/sites-enabled/*
sed -i s/%%API_HOSTNAME%%/${API_HOSTNAME}/g /etc/nginx/sites-enabled/*
sed -i s/%%POOL_HOSTNAME%%/${POOL_HOSTNAME}/g /etc/nginx/sites-enabled/*

if [ ! -f "/etc/letsencrypt/ssl-dhparams.pem" ]; then
	curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "/etc/letsencrypt/ssl-dhparams.pem"
fi

echo "PATH=/bin:/sbin:/usr/sbin:/usr/bin" > /etc/cron.d/certbot
echo "0 */12 * * * root certbot renew --nginx >> /var/log/cron.log 2>&1" >> /etc/cron.d/certbot

do_certonly() {
	sleep 5
	certbot certonly -n --nginx -d openchia.io,pool.openchia.io,www.openchia.io
}

cron

if [ ${dummy} -eq 1 ]; then
	do_certonly &
fi

exec nginx -g "daemon off;"
