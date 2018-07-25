FROM node:latest

WORKDIR /usr/src/facerecognition-api

COPY ./ ./

CMD /bin/bash -c 'npm i nodemon -g; npm install; npm run devstart'