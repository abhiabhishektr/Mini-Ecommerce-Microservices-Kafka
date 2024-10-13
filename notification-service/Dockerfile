FROM node:20.9.0-alpine

WORKDIR /src/app

COPY package.json yarn.lock ./

RUN yarn install --production

# Install type definitions
RUN yarn add --dev @types/express @types/node

COPY . .

RUN yarn build

EXPOSE 3003

CMD ["node", "dist/app.js"]
