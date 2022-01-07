![](.github/assets/landing.png)

# OpenChia.io Angular Website

All our software (api, pool, bot, web, mobile) are open source and available on [Github][1].

## Building UI

Configure the proxy for the API endpoint in `./src/app/proxy.conf.json` and then run:

```bash
$ npm i
$ npm run start
```

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
