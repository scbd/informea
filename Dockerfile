FROM node:4

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -q

COPY . ./

EXPOSE 8000

CMD [ "node", "bootstrap" ]
