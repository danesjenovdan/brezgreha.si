#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

sudo docker build -f ./front/Dockerfile -t brezgreha:latest ./front
sudo docker tag brezgreha:latest rg.fr-par.scw.cloud/djnd/brezgreha:latest
sudo docker push rg.fr-par.scw.cloud/djnd/brezgreha:latest

sudo docker build -f ./counter/Dockerfile -t counter:latest ./counter
sudo docker tag counter:latest rg.fr-par.scw.cloud/djnd/counter:latest
sudo docker push rg.fr-par.scw.cloud/djnd/counter:latest
