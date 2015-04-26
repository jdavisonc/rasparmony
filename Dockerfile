FROM hypriot/rpi-node

RUN apt-get update && apt-get install lirc

RUN mkdir rasparmony

COPY . rasparmony/

RUN cd /rasparmony; npm install
 
# run application
EXPOSE 3000
CMD ["node", "rasparmony/app.js"]