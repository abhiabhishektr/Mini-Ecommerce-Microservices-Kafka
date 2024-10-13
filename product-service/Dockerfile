# Stage 1: Build
FROM node:20.9.0-alpine AS build

WORKDIR /src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Stage 2: Production
FROM node:20.9.0-alpine
WORKDIR /src/app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=build /src/app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/app.js"]
