#!/bin/bash

source /scripts/common.sh
source /scripts/bootstrap-helm.sh


run_tests() {
    echo Running tests...

    wait_pod_ready ethereum-tracker
}

teardown() {
    helm delete --purge ethereum-tracker
}

main(){
    if [ -z "$KEEP_W3F_ETHEREUM_TRACKER" ]; then
        trap teardown EXIT
    fi

    /scripts/build-helm.sh \
        --set environment=ci \
        --set image.tag="${CIRCLE_SHA1}" \
        ethereum-tracker \
        ./charts/ethereum-tracker

    run_tests
}

main
