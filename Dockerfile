FROM node:16.19.0-alpine3.17 as api-ts-compiler
WORKDIR /usr/app
COPY api/. ./
RUN ls
RUN npm install
RUN npm run build
# output is /usr/app/dist

FROM node:16.19.0-alpine3.17 as web-compiler
# make image max mem as 3G otherwise the build failed
ENV NODE_OPTIONS=--max_old_space_size=3072
WORKDIR /usr/app
COPY web/. ./
RUN ls
RUN npm install --force
RUN npm run build
# output is /usr/app/build

FROM node:16.19.0-alpine3.17 as final-remover
WORKDIR /usr/app
COPY --from=api-ts-compiler /usr/app/api/src/package*.json ./
COPY --from=api-ts-compiler /usr/app/dist ./
COPY --from=web-compiler /usr/app/build ./public
RUN npm install --only=production
EXPOSE 8080
USER 1000
CMD ["server.js"]