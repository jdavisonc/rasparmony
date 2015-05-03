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
$ npm app.js
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
# to be continue
```

## Configuration

The configuration of Rasparmony should be prety easy. First, you need to configure your remotes codes on lirc and then start Rasparmony and redirect to `Configuration` section, after that add your remotes or macros via the UI and save it. The UI will create a file `config.json` with the proper configuration.

If you anyway want to configure Rasparmony via file, please check the format below:

config.json
```
{
  "remotes": [
    {
      "name": "TV",                     /* name of the remote */
      "code": "LHV4420",                /* code used on lirc to identify the remote, used on lircd.conf */
      "states": [                       /* manage the state of the device */
        {
          "name": "power",              /* name of the state */
          "menuTrigger": false,  
          "trigger": "POWER",           /* ir command that trigger the switch of options */
          "type": "options",            /* type of state: ["options"] */
          "options": ["on","off"],      /* posible values of state */
          "defaultValue": "off"         /* default values when initialize */
        },
        {
          "name": "input",
          "menuTrigger": true,          /* if first time the trigger will trigger menu instead of switch options */
          "menuTimeout": "15",          /* time in seconds the menu remains open */
          "trigger": "INPUT",
          "type": "options",
          "options": ["tv","component","cable","player"],
          "defaultValue": "tv"
        }
      ],
      "commandAlias": {
        "INPUT": "tv/rad",              /* command alias, if there is no alias then will use the one passed to the API */
        "INFO": "KEY_INFO"
      }
    },
    {
      "name": "HomeTheater",     
      "code": "888888"			 
    }
  ],
  "macros": [
    {
      "name": "Nexus Player",     /* name of the macro */
      "icon": "youtube-play",     /* icon from font-awesome */
      "commands": [
        {
          "remote": "TV",         /* name of the remote on section remotes */
          "state": {              /* expected state of device, will switch options until final state is reached */
          	"name": "power", 
          	"value": "on" 
          }   
        },
        {
          "remote": "HomeTheater",
          "state": { "name": "power", "value": "on" }
        },
        {
          "remote": "TV",
          "state": { "name": "input", "value": "player" }
        }
      ]
    },
    {
      "name": "TV", 			 
      "icon": "gamepad",         
      "commands": [
        {
          "remote": "TV",        
          "command": "POWER"       /* standard lirc key to send, can be set without 'KEY_' (will be appended) */
        },
        {
          "remote": "HomeTheater",
          "command": "POWER"
        }
      ]
    }
  ]
}
```

## API


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