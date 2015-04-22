Rasparmony
========

Like Harmony but with a RaspberryPI - [https://medium.com/@jdavisonc/rasparmony-857ac725aa64]

With Rasparmony you will be able to control all your devices with your smartphone, moreover Rasparmony enables you to run macros! Yes, macros... a set of commands to differents devices. This is, turn on your TV, the Home Theather and set input mode to HDMI1 on the TV.

Rasparmony starts as fork of `lirc_web` with the idea to extend it. It has a lot of new features in order to be user friendly with a easy setup. 

Rasparmony use:

* LIRC Web - [https://github.com/alexbain/lirc_web]
* LIRC Node - [https://github.com/alexbain/lirc_node]
* MobileAngularUI - [http://mobileangularui.com/]

## Usage

### From GIT repo
```
git clone https://github.com/jdavisonc/rasparmony.git
cd rasparmony
cp test/fixtures/config.json .

# here edit the config.json with your configuration (this will be necessary in a near future)
# vim config.json
# nano config.json

npm install
npm app.js
```

### From Docker image

```
# to be continue
```

### config.json

```
{
  "remotes": {
    "TV": {
      "name": "TV",              /* name of the remote */
      "code": "LHV4420"          /* code used on lirc to identify the remote, used on lircd.conf */
    },
    "HomeTheater": {
      "name": "HomeTheater",     
      "code": "888888"			 
    }
  },
  "macros": {
    "TV": {
      "name": "TV", 			 /* name of the macro */
      "icon": "gamepad",         /* icon from font-awesome */
      "commands": [
        {
          "remote": "TV",        /* name of the remote on section remotes */
          "command": "KEY_POWER" /* standard lirc key to send */
        },
        {
          "remote": "HomeTheater",
          "command": "KEY_POWER"
        }
      ]
    }
  }
}
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