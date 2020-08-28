FROM node:12.11.1-alpine
ENV NODE_ENV production

RUN mkdir -p /app
WORKDIR /app

COPY packages/common/package*.json ./packages/common/
COPY packages/server/package*.json ./packages/server/
COPY package*.json ./
COPY lerna.json ./

RUN npm install \
    && npm install -g lerna \
    && lerna bootstrap

COPY config ./config/
COPY packages/common ./packages/common/
COPY packages/server ./packages/server/

RUN lerna run build

EXPOSE 8000
CMD cd packages/server && npm run server:migrations && npm run server:start
