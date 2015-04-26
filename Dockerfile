FROM hypriot/rpi-node
MAINTAINER Jorge Davison <jdavisonc@gmail.com>

RUN apt-get update && apt-get install -y lirc \
	--no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir rasparmony

COPY src rasparmony/src
COPY www rasparmony/www
COPY app.js rasparmony/app.js
COPY package.json rasparmony/package.json

RUN cd /rasparmony; npm install
 
# run application
EXPOSE 3000
CMD ["node", "rasparmony/app.js"]