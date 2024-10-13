FROM node:20.9.0-alpine

WORKDIR /src/app

COPY package.json yarn.lock ./

RUN yarn install --production

RUN yarn global add typescript

RUN yarn add --dev @types/express @types/node

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/app.js"]
