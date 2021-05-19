FROM node:12-slim AS build
WORKDIR /app
COPY . .
WORKDIR /app/web
RUN \
  yarn && \
  yarn build
WORKDIR /app/server
RUN apt-get update \
  && apt-get install -y --no-install-recommends libexpat1-dev libnss3-dev \
  && apt-get install -y python make g++
RUN \
  yarn && \
  yarn build

FROM node:12-slim
WORKDIR /app
COPY --from=build /app/web/dist ./web/dist/
COPY --from=build /app/server/dist ./server/dist/
COPY --from=build /app/web/package.json ./web/
COPY --from=build /app/server/package.json ./server/
COPY --from=build /app/web/yarn.lock ./web/
COPY --from=build /app/server/yarn.lock ./server/
ENV NODE_ENV=production
WORKDIR /app/server
RUN apt-get update \
  && apt-get install -y --no-install-recommends libexpat1-dev libnss3-dev \
  && apt-get install -y python make g++
RUN \
  yarn
CMD [ "node", "dist/index.js" ]
