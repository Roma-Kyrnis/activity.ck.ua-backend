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
sudo docker-compose up --build
```

## 4. Migrations
### 1. Start migration with found container_id
```bash
sudo docker exec -it node npm run knex:migrate:latest
```

### 2. Plant seeds
```bash
sudo docker exec -it node npm run seeds:make
```
