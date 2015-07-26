#!/bin/bash
set -e

LIRC_GPIO_IN=${LIRC_GPIO_IN:-23}
LIRC_GPIO_OUT=${LIRC_GPIO_OUT:-22}

# Load needed modules
modprobe lirc_dev
modprobe lirc_rpi gpio_in_pin=$LIRC_GPIO_IN gpio_out_pin=$LIRC_GPIO_OUT

exec "$@"