FROM node:12.11.1 as build

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Build
COPY ./packages/marketing /usr/src/app/
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/dist/spa/ /usr/share/nginx/html
