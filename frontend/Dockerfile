FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=
ARG VITE_SITE_URL=
ARG VITE_STREAMLIT_URL=
ARG BUILD_CMD=build
ENV VITE_API_URL=$VITE_API_URL VITE_SITE_URL=$VITE_SITE_URL VITE_STREAMLIT_URL=$VITE_STREAMLIT_URL
RUN npm run $BUILD_CMD

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
