#!/bin/bash

#           BUILD Server component
git pull
mvn clean install -P docker

#           BUILD Front component
cd front

#rm -Rf build
#npm run generate-api
#npm run build

#           DEPLOY(copy) Front component
#rm -Rf /usr/share/nginx/html/*
#cp -R build/* /usr/share/nginx/html/

#           DEPLOY(restart) Server component
cd /opt/eventos/chatcontact-server
./restart.sh

