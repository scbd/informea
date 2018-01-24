FROM node:4-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -q

COPY . ./

EXPOSE 8000

CMD [ "node", "bootstrap", "--recycle" ]
