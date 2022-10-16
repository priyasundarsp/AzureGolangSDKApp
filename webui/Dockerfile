FROM node:lts-alpine3.15 AS build-process

WORKDIR /myapp
COPY package.json ./
RUN npm install

COPY src ./
RUN npm run build

FROM nginx:1.18-alpine
COPY --from=build-process /myapp/build /frontend/dist
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
