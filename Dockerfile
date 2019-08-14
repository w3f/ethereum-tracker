FROM node:10.16-alpine

WORKDIR /app

RUN apk update && apk add --no-cache \
  python \
  g++ \
  make \
  openssh \
  git

RUN export PYTHONPATH=${PYTHONPATH}:/usr/lib/python2.7

COPY . .

RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]
