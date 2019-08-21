#!/bin/bash

CIRCLE_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
CIRCLE_WORKING_DIRECTORY=$PWD
EX_BRANCH="master"

for file in $CIRCLE_WORKING_DIRECTORY/*
do
    FILE_NAME=$(basename $file)
    echo "test against dir -> ${FILE_NAME}"
done
