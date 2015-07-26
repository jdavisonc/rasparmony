#!/bin/bash
#
# Script to configure a device remote code on lircd installation.
#
# Requirements: git lircd
# Author: Jorge Davison

CODES_DIR=lirc-remotes-code/remotes/
LIRCD_CONF_PATH=/etc/lirc/lircd.conf

_term() {
	cat $LIRCD_CONF_PATH >> $LIRCD_CONF_PATH.bck
	rm $LIRCD_CONF_PATH
	cp $LIRCD_CONF_PATH.bck $LIRCD_CONF_PATH

	popd
}
# trap keyboard interrupt (control-c)
trap _term SIGINT

# Backup lircd conf
cp $LIRCD_CONF_PATH $LIRCD_CONF_PATH.bck

pushd $INSTALLATION_PATH
cd $CODES_DIR

printf "Please select the device brand:\n"
select brand in */; do test -n "$brand" && break; echo ">>> Invalid Selection"; done
cd "$brand"

echo "Iteration will begin, please break the script 'Ctrl+C' when your device shutdown"
sleep 2

for filename in *.conf; do
	CODE_NAME=$(sed -ne "s/\s*name\s*\(\d*\)\s*/\1/p" $filename)
	echo "Testing with file '$filename' (code '$CODE_NAME')..."

	rm /etc/lirc/lircd.conf
	ln -s $CODES_DIR/$brand/$filename $LIRCD_CONF_PATH
	/etc/init.d/lirc restart

	echo "Sending KEY_POWER with $CODE_NAME..."
	irsend SEND_ONCE $CODE_NAME KEY_POWER
	sleep 10
done
