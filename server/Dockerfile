FROM node:14-alpine
RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN yarn install
EXPOSE 4040
CMD [ "yarn", "start" ]
