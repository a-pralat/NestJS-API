FROM node:16.15 as builder
RUN mkdir -p /usr/build
WORKDIR /usr/build
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

FROM node:16.15-alpine
RUN mkdir -p /www
WORKDIR /www
COPY --from=builder /usr/build/dist dist
COPY package.json .
COPY yarn.lock .
COPY prisma .
RUN yarn
RUN yarn build:prisma
CMD node dist/main.js
