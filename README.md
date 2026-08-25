## Video with task and gameplay descriptions

[Watch video sprints 5-6](https://disk.yandex.ru/i/MYjitxRMnymmdw)
[Watch video sprints 7-8](https://disk.yandex.ru/i/fBW_eEq5nGCfJQ)

### Game description

Detailed description of the Tower Defense game's engine and logic: [Game Engine Documentation](packages/client/src/pages/Game/core/README.md)

### How to run it?

1. Make sure you have `node` and `docker` installed
2. Run `yarn bootstrap` - this is a required step, nothing will work without it :)
3. Run `yarn dev`
4. Run `yarn dev --scope=client` to start only the client
5. Run `yarn dev --scope=server` to start only the server

### How to add dependencies?

This project uses a `monorepo` based on [`lerna`](https://github.com/lerna/lerna)

To add a dependency for the client
`yarn lerna add {your_dep} --scope client`

For the server
`yarn lerna add {your_dep} --scope server`

For both the client and the server
`yarn lerna add {your_dep}`

If you want to add a dev dependency, do the same but with the `dev` flag
`yarn lerna add {your_dep} --dev --scope server`

### Tests

The client uses [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

`yarn test`

### Linting

`yarn lint`
`yarn lintfix`

### Prettier formatting

`yarn format`

### Production build

`yarn build`

And to preview the result

`yarn preview --scope client`
`yarn preview --scope server`

## Hooks

The project uses [lefthook](https://github.com/evilmartians/lefthook)
If you really-really need to skip the checks, use `--no-verify` (but don't abuse it :)

## Oh, nothing works :(

Open an issue, I'll come :)

## Auto-deploying static assets on vercel

Register an account on [vercel](https://vercel.com/)
Follow the [instructions](https://vitejs.dev/guide/static-deploy.html#vercel-for-git)
Specify `packages/client` as the `root directory`

All your PRs will be automatically deployed to vercel. The deploying bot will provide you the URL

## Production environment in docker

Before the first run, execute `node init.js`

`docker compose up` - will start three services

1. nginx, serving the client static files (client)
2. node, your server (server)
3. postgres, your database (postgres)

If you only need one service, just specify which one in the command
`docker compose up {sevice_name}`, for example `docker compose up server`
