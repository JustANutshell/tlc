if (( $EUID != 0 )); then
  echo "Please run this script as root"
  echo "write 'sudo bash ./install.sh'"
  exit
fi
sudo apt-get update
sudo apt-get upgrade
if ! [ -x "$(command -v node)" ]; then
  echo 'node is not installed: installing'
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo -rf node_modules/
sudo -rf package-lock.json
sudo npm i
npm install -g typescript
echo "node: `node -v`"
echo "npm:  `npm -v`"
echo "----------------------------------------------------------------------------------------------------------"
echo "to start tlc, type: 'sudo node build/index' or 'sudo npm start'"
echo "to update, run: 'sudo bash ./update.sh'"
echo "make sure to change the pin numbers in the file config.json with the command 'sudo nano ./config.json' (to save: strg+x -> y -> ent)"