FROM node:20.9.0

WORKDIR /src/app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/app.js"]
