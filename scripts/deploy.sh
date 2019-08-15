#!/bin/sh

/scripts/deploy.sh -c community \
                   helm \
                   --set image.tag="${CIRCLE_TAG}" \
                   ethereum-tracker \
                   w3f/ethereum-tracker
