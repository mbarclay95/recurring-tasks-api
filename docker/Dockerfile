# build stage
FROM node:lts-alpine as build-stage
WORKDIR /usr/src/app

RUN apk add --no-cache tzdata
ENV TZ America/Los_Angeles

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .
RUN npm run build

RUN ls -la

COPY . .

RUN ls -la dist/

ENV NODE_ENV production
CMD [ "node", "dist/index.js" ]
USER node


