FROM node:12.11.1-alpine as build

ENV API_ENDPOINT https://api.createvid.io/v1/

RUN mkdir -p /app
WORKDIR /app

COPY packages/frontend/package*.json ./

RUN npm install

COPY packages/frontend ./

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
