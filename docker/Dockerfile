# build stage
FROM node:lts-alpine as build-stage
WORKDIR /usr/src/app

COPY package.json ./
#COPY yarn.lock ./

RUN npm install
RUN npm run build

COPY . .

ENV NODE_ENV production
CMD [ "node", "dist/index.js" ]
USER node


