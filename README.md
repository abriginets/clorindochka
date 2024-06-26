<p align="center">
  I've been starting so many NestJS projects lately. Now it's time to create a template and share it with the world.
</p>

## Features

- Automatic NodeJS version control through [asdf](https://asdf-vm.com/) 😎
- Prettier for making it pretty 👦
- [Airbnb](https://www.npmjs.com/package/eslint-config-airbnb)-based ESLint for keeping it consistent ⚡
- `.editorconfig` for making it cross-IDE ✅
- Automatic import sorting and grouping 💪
- VSCode config to kickstart all the linters and prettiers using `formatOnSave` 🤤
- Winston powered logging. Formatted and colored for devs, forced JSON for machines 😏
- Strictly typed handcrafted config service 👽

## Getting Started

Make sure you have [asdf](https://asdf-vm.com/guide/getting-started.html) installed along with [asdf-nodejs plugin](https://github.com/asdf-vm/asdf-nodejs/) before you get started

After checking out the repository execute the following command

```sh
$ asdf install
```

Check currently installed NodeJS version. It should match the one specified in `.tool-versions` file:

```sh
$ node -v
> v20.11.0
```

And that's it! You are good to go 🎆

### Setting up production database

Before deploying your own Clorinde bot to production, you must first to create a MySQL database. To do so you should first generate a unique password for your production database by executing the following command:

```bash
$ chmod +x ./scripts/generate-prod-db-pass.sh
$ ./scripts/generate-prod-db-pass.sh
```

This will generate a password and put it into `docker/production/docker-compose.yml` for you. After that you can just `cd` into directory with this yaml and run

```bash
$ docker compose up -d
```
