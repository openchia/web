#!/bin/sh
set -x

sed -i s,%%DOMAIN%%,${DOMAIN:=localhost},g /etc/Caddyfile

exec caddy run --config /etc/Caddyfile
