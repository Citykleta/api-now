FROM node:10-alpine

# install dependencies
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install

COPY . /opt/app

RUN npm run build

