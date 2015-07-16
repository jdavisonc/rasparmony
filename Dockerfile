FROM resin/rpi-node
#FROM hypriot/rpi-node
MAINTAINER Jorge Davison <jdavisonc@gmail.com>

RUN apt-get update && \
	apt-get install -y lirc --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir rasparmony
WORKDIR rasparmony

COPY app.js app.js
COPY package.json package.json

RUN npm install --production

COPY www www

EXPOSE 3000

CMD ["npm", "start"]