FROM node:20.9.0-alpine

WORKDIR /app/gateway/api-gateway

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn global add typescript

COPY . .

EXPOSE 5000

CMD ["yarn", "start"]
