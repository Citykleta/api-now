FROM node:10-alpine

# install dependencies
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install

COPY . .
