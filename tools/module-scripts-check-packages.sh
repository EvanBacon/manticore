#!/usr/bin/env bash
# Copyright 2019-present 650 Industries. All rights reserved.

set -euo pipefail

# function checkPackage {
buildFolder=${1:-"./build/"}

packageName=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

printf "🔍 Checking the \e[1m\e[32m${packageName}\e[00m package...\n\n";

function hasScript {
    echo "$(cat package.json | grep "\"$1\"\:" | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')"
}

function strictlyRunScript {
    if [ "$(hasScript $1)" != "" ]; then
        runScript $@
    else
        printf "🤷‍♀️ \e[31mRequired script \`\e[0;36m${1}\e[00m\e[31m\` not found, exiting...\e[00m\n";
        exit 1
    fi
}

function optionallyRunScript {
    if [ "$(hasScript $1)" != "" ]; then
        runScript $@
    else
        printf "🤷‍♀️ \e[33mOptional script \`\e[0;36m${1}\e[00m\e[33m\` not found, skipping...\e[00m\n\n";
    fi
}

function runScript {
    printf "🏃‍♀️ Running \`\e[0;36mnpm run ${1}\e[00m\` ...\n";
    npm run $@
}

export EXPO_NONINTERACTIVE="true"

### To test TypeScript builds like expo/expo:

optionallyRunScript test --watch=false --passWithNoTests --maxWorkers=1

printf "✨ \e[1m\e[32m${packageName}\e[00m checks passed!\n";