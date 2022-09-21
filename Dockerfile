FROM node:14-alpine

RUN apk update  -q && \
    apk upgrade -q && \
    apk add     -q --no-cache bash git

RUN apk add --update curl && \
    rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -q

COPY . ./

EXPOSE 8000

CMD [ "node", "bootstrap", "--recycle" ]
