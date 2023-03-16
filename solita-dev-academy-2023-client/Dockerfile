FROM node:19-alpine as builder

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build-prod

FROM nginx:1.23-alpine as production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]