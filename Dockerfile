FROM node:10-alpine
WORKDIR /app
COPY . /app
EXPOSE 4000
RUN yarn
CMD yarn start