FROM node:22-alpine AS builder

WORKDIR /app

ARG SANITY_PROJECT_ID=lxmhb5oh
ARG SANITY_DATASET=production
ARG SANITY_API_VERSION=2025-01-01

COPY package*.json ./
RUN npm ci

COPY . .
RUN SANITY_PROJECT_ID=$SANITY_PROJECT_ID \
    SANITY_DATASET=$SANITY_DATASET \
    SANITY_API_VERSION=$SANITY_API_VERSION \
    npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
