# CRUD database

This repo is the base for build a Postgres docker image.
It create a user timy for the database timy.

First, creates the container of the database.
```sh
# This build the container image timy-database for Docker
./build.sh
```

Second, run the container.
```sh
# This will run the container. If the container timy-database has already be
#  created, it will be reused. Otherwise it will creates a new one.
./run.sh
```

If you need to stop your database, you can use the script.
```sh
# This will find the container timy-database and stop it.
./stop.sh
```
