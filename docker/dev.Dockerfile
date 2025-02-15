FROM node:23.6.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install