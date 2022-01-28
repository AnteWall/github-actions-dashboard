FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "run", "dev"]