sudo apt-get update
sudo apt-get dist-upgrade
if ! [ -x "$(command -v node)" ]; then
  echo 'node is not installed: installing'
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo node -v
echo npm -v
sudo npm i
echo "to start tlc, type: 'sudo node index'"
echo "to update, run: 'sudo bash ./update.sh'"