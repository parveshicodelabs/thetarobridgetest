FROM node:16.18.1
WORKDIR /var/www/html/tarobridge
ARG ENVFILE
USER root
COPY ./ ./
COPY $ENVFILE ./.env
COPY ./package.json /.
RUN yarn install && yarn build
CMD ["npm", "start"]

