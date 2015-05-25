#!/bin/bash
INSTALLATION_PATH=/tmp

cd $INSTALLATION_PATH

git clone git://git.code.sf.net/p/lirc-remotes/code lirc-remotes-code
CODES_DIR=$INSTALLATION_PATH/lirc-remotes-code/remotes/

cd $CODES_DIR

printf "Please select the device brand:\n"
select brand in */; do test -n "$brand" && break; echo ">>> Invalid Selection"; done
cd "$brand"

for filename in *.conf; do
	CODE_NAME=$(sed -ne "s/\s*name\s*\(\d*\)\s*/\1/p" $filename)
	echo "Testing with file '$filename' (code '$CODE_NAME')..."

	rm /etc/lirc/lircd.conf
	ln -s $CODES_DIR/$brand/$filename /etc/lirc/lircd.conf
	/etc/init.d/lirc restart

	echo "Sending KEY_POWER with $CODE_NAME..."
	irsend SEND_ONCE $CODE_NAME KEY_POWER
	echo "Command send, please break the script when you are satisfied"
	sleep 10
done

#TODO
# Capture Ctrl+C and create lircd file or append to the existent one