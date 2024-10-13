FROM node:20.9.0-alpine

WORKDIR /src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

RUN yarn global add typescript

COPY . .

RUN yarn add --dev @types/express @types/node

RUN yarn build

EXPOSE 3002

CMD ["node", "dist/app.js"]
