#!/bin/sh

/scripts/deploy.sh helm \
                   --set image.tag="${CIRCLE_TAG}" \
                   ethereum-tracker \
                   w3f/ethereum-tracker
