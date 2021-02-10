# activity.ck.ua-backend

# 1 create .env file
cp .env.example .env

# 2 replace parameters with real
nano .env

# 3 install dependencies
npm i -ci

# 4 start docker-compose
docker-compose up -d

# 5 start migrations
npm run knex:migrate:latest 

# 6 run
npm start
