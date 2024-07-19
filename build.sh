#!/bin/bash

docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

docker build -f ./front/Dockerfile -t brezgreha:latest ./front
docker tag brezgreha:latest rg.fr-par.scw.cloud/djnd/brezgreha:latest
docker push rg.fr-par.scw.cloud/djnd/brezgreha:latest

docker build -f ./counter/Dockerfile -t counter:latest ./counter
docker tag counter:latest rg.fr-par.scw.cloud/djnd/counter:latest
docker push rg.fr-par.scw.cloud/djnd/counter:latest
