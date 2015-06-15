#!/bin/sh

docker build -t localhost:5000/informea git@github.com:scbd/informea.git
docker push localhost:5000/informea
