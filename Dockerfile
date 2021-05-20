FROM node:16-alpine AS build
WORKDIR /app
COPY . .
WORKDIR /app/web
RUN \
  yarn && \
  yarn build
WORKDIR /app/server
RUN \
  yarn && \
  yarn build

FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/web/dist ./web/dist/
COPY --from=build /app/web/package.json ./web/
COPY --from=build /app/web/yarn.lock ./web/
COPY --from=build /app/server/dist ./server/dist/
COPY --from=build /app/server/package.json ./server/
COPY --from=build /app/server/yarn.lock ./server/
COPY --from=build /app/server/migrations ./server/migrations
ENV NODE_ENV=production
WORKDIR /app/server
RUN \
  yarn
CMD [ "node", "dist/index.js" ]
