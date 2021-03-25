<!-- # activity.ck.ua-backend

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
npm start -->


# Docker-compose. Start server in container

## 1. Create .env file
```bash
cp .env.example .env
```

## 2. Replace parameters with real
```bash
nano .env
```

## 3. Start container
```bash
docker-compose up --build || sudo docker-compose up --build
```

## 4. Migrations
### 1. Find container_id with image name "node-app"
```bash
docker ps
```

### 2. Start migration with found container_id
```bash
docker exec -it [CONTAINER_ID] npm run knex:migrate:latest
```

### 3. Plant seeds
```bash
docker exec -it [CONTAINER_ID] npm run seeds:make
```
