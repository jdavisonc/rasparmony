FROM resin/rpi-node
MAINTAINER Jorge Davison <jdavisonc@gmail.com>

RUN apt-get update && \
	apt-get install -y lirc --no-install-recommends && \
	mkdir -p /var/run/lirc/ && \
    rm -rf /var/lib/apt/lists/* 

RUN sed -i "s/DRIVER=\"UNCONFIGURED\"/DRIVER=\"default\"/" /etc/lirc/hardware.conf && \
	sed -i "s/DEVICE=\"\"/DEVICE=\"\/dev\/lirc0\"/" /etc/lirc/hardware.conf && \
	sed -i "s/MODULES=\"\"/MODULES=\"lirc_rpi\"/" /etc/lirc/hardware.conf && \
	sed -i "s/LIRCD_ARGS=\"\"/LIRCD_ARGS=\"--uinput\"/" /etc/lirc/hardware.conf

RUN mkdir rasparmony
WORKDIR rasparmony

RUN git clone git://git.code.sf.net/p/lirc-remotes/code lirc-remotes-code

COPY entrypoint.sh /
COPY app.js app.js
COPY package.json package.json

RUN npm install --production
COPY www www

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]