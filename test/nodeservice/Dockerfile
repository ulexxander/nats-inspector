FROM node:alpine
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN \
  yarn
CMD [ "node", "index.js" ]
