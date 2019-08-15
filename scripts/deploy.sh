#!/bin/bash

set -eox

/scripts/deploy.sh -c community \
                   -t helm \
                   -a --set image.tag="${CIRCLE_TAG}" \
                   ethereum-tracker \
                   w3f/ethereum-tracker
