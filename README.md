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
Replace `[CONTAINER_ID]` with real container id from 4.1 pips
### 1. Find container_id with image name "node-app"
```bash
sudo docker ps
```

### 2. Start migration with found container_id
```bash
sudo docker exec -it [CONTAINER_ID] npm run knex:migrate:latest
```
## Extra:
### 3. Plant default user and organization seed
This need to create place refer to `user_id` and `organization_id`
```bash
sudo docker exec -it [CONTAINER_ID] npm run seeds:default
```

### 4. Plant places
You can add extra parameters: `count`, `user_id` and `organization_id`. Where `count` is how many places will be create. If you don't add parameters they set by default.

```bash
sudo docker exec -it [CONTAINER_ID] npm run seeds:places
```

Example with `10` created places attach to user with id `1` and organization with id `1`
```bash
sudo docker exec -it [CONTAINER_ID] npm run seeds:places count=10 user_id=1 organization_id=1
```
