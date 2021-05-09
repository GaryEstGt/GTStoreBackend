FROM node:carbon-alpine
RUN mkdir /my_app
COPY GTStore_Backend/app.js /my_app
COPY GTStore_Backend/package.json /my_app
COPY  GTStore_Backend/package-lock.json /my_app
WORKDIR /my_app
RUN npm install md5
RUN npm install
EXPOSE 4200
CMD node app.js

