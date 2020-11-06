#!/bin/bash

cd front

rm -Rf build
npm run generate-api
npm run build

rm -Rf /usr/share/nginx/html/*
cp -R build/* /usr/share/nginx/html/
