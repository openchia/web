![](.github/assets/landing.png)

<p align="center">
  <a style="text-decoration:none" href="https://github.com/openchia/web/blob/main/LICENSE.md">
    <img alt="License" src="https://img.shields.io/github/license/openchia/web?logo=github&color=0&label=License&style=flat-square">
  </a>
  <a style="text-decoration:none" href="https://github.com/openchia/web/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/openchia/web?logo=github&color=0&label=Issues&style=flat-square">
  </a>
  <a style="text-decoration:none" href="https://github.com/openchia/web/actions/workflows/docker-publish.yml">
    <img alt="Docker CI/CD" src="https://img.shields.io/github/actions/workflow/status/openchia/web/docker-publish.yml?logo=github&color=0&label=Pipeline&style=flat-square">
  </a>
  <a style="text-decoration:none" href="https://discord.gg/2URS9H7RZn">
    <img alt="Discord" src="https://img.shields.io/discord/865233670938689537?logo=discord&color=0&logoColor=white&label=Discord&style=flat-square">
  </a>
  <a style="text-decoration:none" href="https://twitter.com/openchia">
    <img alt="Twitter" src="https://img.shields.io/twitter/follow/openchia?color=blue&label=Twitter&logo=twitter&logoColor=white&style=flat-square">
  </a>
  <a style="text-decoration:none" href="https://www.youtube.com/channel/UCL70j_KiPd49rfp_UEqxiyQ">
    <img alt="YouTube" src="https://img.shields.io/youtube/channel/subscribers/UCL70j_KiPd49rfp_UEqxiyQ?label=YouTube&logo=youtube&logoColor=white&style=flat-square">
  </a>
  <a style="text-decoration:none" href="https://crowdin.com/project/openchia-web">
    <img alt="Translations" src="https://badges.crowdin.net/openchia-web/localized.svg"/>
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

We are currently using [Crowdin](https://crowdin.com/).
All you need to do is create an account and translate to your language using the [website here][2].

## Security

Code and Docker image are scanned by [Trivy](https://github.com/aquasecurity/trivy). All results are in [GitHub Security tab](https://github.com/openchia/web/security/code-scanning).

## Contributing

All contributions are welcome! Please fork main branch and create a new branch, and then create a pull request to the main branch.

Linear merging is enforced on main and merging requires a completed build and review. Please make sure your code/build is passing.
The main branch is usually the currently released latest version on website and on the [Docker image][3].

## License

**OpenChia** is made with ♥ by [team][4] and it's released under the AGPLv3 license.

[1]: https://github.com/openchia
[2]: https://translation.openchia.io
[3]: https://github.com/openchia/web/pkgs/container/web
[4]: https://github.com/openchia/web/graphs/contributors
