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
## Extra:
### 3. Plant default user and organization seed
This need to create place refer to `user_id` and `organization_id`
```bash
sudo docker exec -it node npm run seeds:default
```

### 4. Plant places
You can add extra parameters: `count`, `user_id` and `organization_id`. Where `count` is how many places will be create. If you don't add parameters they set by default.

```bash
sudo docker exec -it node npm run seeds:places
```

# Example:
Create `10` places attach to user with id `1` and organization with id `1`. If you add `user_id` and `organization_id` parameters where user and organization should already exist in database than find real ids in database and use it here.
```bash
sudo docker exec -it node npm run seeds:places count=10 user_id=1 organization_id=1
```
