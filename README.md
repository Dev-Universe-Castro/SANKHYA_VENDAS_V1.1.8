git clone ""
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cd /home/crescimentoerp/SANKHYA_VENDAS_V1.1.8/.next/standalone
npm install bcrypt
sudo ufw allow 5000/tcp
sudo ufw reload
pm2 start ecosystem.config.js --env production

pm2 save
