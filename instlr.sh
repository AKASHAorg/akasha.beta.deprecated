#!/bin/bash

cd akasha/channels
for dir in /home/vali/akasha/akasha/channels/*/
do
    dir=${dir%*/}
    cd /${dir}
    npm install
    pwd
    cd ..
    
done