if (( $EUID != 0 )); then
  echo "Please run this script as root"
  echo "write 'sudo bash ./update.sh'"
  exit
fi
git fetch origin
git pull
sudo npm i