#!/bin/sh

docker build -t registry.infra.cbd.int:5000/informea git@github.com:scbd/informea.git
docker push registry.infra.cbd.int:5000/informea
