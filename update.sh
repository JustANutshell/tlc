if (( $EUID != 0 )); then
  echo "Please run this script as root"
  echo "write 'sudo bash ./update.sh'"
  exit
fi
echo "INFO: If you have trouble while updating and have the config.json file already changed, it's possible that you have to delete config.json ('sudo rm config.json')"
git fetch origin
git pull
sudo npm i