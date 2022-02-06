#!/bin/sh
docker stop `docker ps | grep timy-database | cut -c 1-12` 1> /dev/null 2> /dev/null
if [ $? -eq 0 ]; then
  echo Stop successful
else
  echo Container timy-database not found
fi
