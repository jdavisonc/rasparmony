Rasparmony
========

Like Harmony but with a RaspberryPI - [https://medium.com/@jdavisonc/rasparmony-857ac725aa64]

With Rasparmony you will be able to control all your IR devices with your smartphone, moreover Rasparmony enables you to run macros! Yes, macros... a set of commands to run of different devices. This is, turn on your TV, the Home Theather and set input mode to HDMI1 on the TV, all in one click.

Rasparmony starts as fork of `lirc_web` with the idea to extend it. It has a lot of new features in order to be user friendly with an easy setup.

Rasparmony use:

* LIRC Web - [https://github.com/alexbain/lirc_web]
* LIRC Node - [https://github.com/alexbain/lirc_node]
* MobileAngularUI - [http://mobileangularui.com/]

## Features

* API based
* Send plain IR commands through API
* Device and commands alias
* Mobile WebUI to easy configure your devices
* *Device States*: Holds the device state depending on the configuration. This enable the user to configure macros in a more real way instead of set how many time the command X should be send. Just set the expected state of the device in the macro, supports more than one state per device (see config.json).

## Usage

### From GIT repo
```
$ git clone https://github.com/jdavisonc/rasparmony.git
$ cd rasparmony

$ npm install
$ npm start
```

To start Rasparmony on boot time you will need to execute the following commands:
```
sudo npm install forever -g
cp init.d/rasparmony /etc/init.d/.
chmod +x init.d/rasparmony
sudo update-rc.d rasparmony default

# Now you can execute Rasparmony as a Service on your RasperryPI
sudo service rasparmony start|stop
```

NOTE: Update `RASPARMONY_PATH` variable with the actual PATH where you locate Rasparmony code.

### From Docker image

```
docker run --restart=always -d -p 3000:3000 -e RASPARMONY_CONFIG=/rasparmony/config/config.json --device /dev/mem:/dev/mem -v /lib/modules:/lib/modules -v /root/config:/rasparmony/config --cap-add=ALL --privileged -it jdavisonc/rasparmony
```

Variables:
* LIRC_GPIO_IN - Default 23
* LIRC_GPIO_OUT - Default 22


## ScreenShots

![Image](http://i.imgur.com/wqfFmBb.png)
![Image](http://i.imgur.com/7xvgqqu.png)
![Image](http://i.imgur.com/kR9wcBh.png)

More Images on http://imgur.com/a/yeiic#wqfFmBb

## Development

```
$ git clone https://github.com/jdavisonc/rasparmony.git
$ cd rasparmony
$ gulp

# Server starts on port 3000
```


## License

(The MIT License)

Copyright (c) 2015 Jorge Davison &lt;jdavisonc@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.