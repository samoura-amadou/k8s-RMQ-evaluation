# Crud database

This repo is the base for build a postgres docker image.
It create a user timy for the database timy.

```sh
docker build -t timy-database .
```

```sh
docker run -p 5432:5432 -d -t --restart unless-stopped timy-database
```
