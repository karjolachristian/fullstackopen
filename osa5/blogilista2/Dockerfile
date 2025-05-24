FROM node AS builder
WORKDIR /usr/src/app
COPY . .
ENV VITE_BACKEND_URL=http://localhost:8080
RUN npm ci && npm run build
FROM nginx:1-alpine3.19
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
