![](.github/assets/landing.png)

<p align="center">
  <a style="text-decoration:none" href="https://github.com/openchia/web/blob/main/LICENSE.md">
    <img alt="License" src="https://img.shields.io/github/license/openchia/web?logo=github&color=0&label=License">
  </a>
  <a style="text-decoration:none" href="https://github.com/openchia/web/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/openchia/web?logo=github&color=0&label=Issues">
  </a>
  <a style="text-decoration:none" href="https://github.com/openchia/web/actions/workflows/deploy.yaml">
    <img alt="Node CI" src="https://img.shields.io/github/workflow/status/openchia/web/Node CI?logo=github&color=0&label=Node CI">
  </a>
  <a style="text-decoration:none" href="https://github.com/openchia/web/actions/workflows/docker-publish.yml">
    <img alt="Docker" src="https://img.shields.io/github/workflow/status/openchia/web/Docker?logo=github&color=0&label=Docker">
  </a>
  <a style="text-decoration:none" href="https://discord.gg/2URS9H7RZn">
    <img alt="Discord" src="https://img.shields.io/discord/865233670938689537?logo=discord&color=0&logoColor=white&label=Discord">
  </a>
</p>

# OpenChia.io Angular Website

All our software (api, pool, bot, web, mobile, proxy) are open source and available on [Github][1].

## Building UI

### From local

Configure the proxy for the API endpoint in `./src/app/proxy.conf.json` and then run:

```bash
$ npm i
$ npm run start
```

After local build, website will be accessible on [https://localhost:4200](https://localhost:4200).

### From docker

```
$ docker build -t openchia/web .
$ docker container run --rm --name openchia-web -p 8080:80 openchia/web
```

After docker build, website will be accessible on [http://localhost:8080](http://localhost:8080).

By default caddy listen on port 80 but we bind it to port 8080 which allows you to launch image without root permissions.

Variables available in the docker environment:
* `DOMAIN`: website domain (default: `localhost`)
* `LOGLEVEL`: loglevel in stdout (default: `INFO`)
* `LOGFORMAT`: log format in stdout (default: `json`)

## Translation

We are currently using [Localazy][2] to ease the translation process.
All you need to do is create an account and translate to your language using the [website here][3]

## Contributing

All contributions are welcome! Please fork main branch and create a new branch, and then create a pull request to the main branch.

Linear merging is enforced on main and merging requires a completed build and review. Please make sure your code/build is passing.
The main branch is usually the currently released latest version on website and on the [Docker image][4].

[1]: https://github.com/openchia
[2]: https://localazy.com
[3]: https://localazy.com/p/openchia
[4]: https://github.com/openchia/web/pkgs/container/web
