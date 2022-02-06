#!/bin/sh
docker start timy-database 1> /dev/null 2> /dev/null
if [ $? -ne 0 ]; then
  docker rename `docker run -p 5432:5432 -d -t --restart unless-stopped timy-database | cut -c 1-12` timy-database
fi
echo Start successful
