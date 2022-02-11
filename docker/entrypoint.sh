#!/bin/sh
set -x

sed -i "s,%%DOMAIN%%,${DOMAIN:=localhost},g" /etc/Caddyfile
sed -i "s,%%LOGLEVEL%%,${LOGLEVEL:=INFO},g" /etc/Caddyfile
sed -i "s,%%LOGFORMAT%${LOGFORMAT:=json}%,,g" /etc/Caddyfile

exec caddy run --config /etc/Caddyfile
