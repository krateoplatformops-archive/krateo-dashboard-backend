# Kerberus Dashboard Backend

### Preinstalled plugins

```
- Kubernetes
```

### Sample docker-compose.yaml

```
version: '3.7'

services:
  kerberus.be:
    build: .
    container_name: kerberus.be
    image: prokjectkerberus/kerberus-dashboard-backend
    restart: always
    environment:
      - POSTGRES_HOST=host.docker.internal
      - POSTGRES_PORT=5432
      - POSTGRES_USER=username
      - POSTGRES_PASSWORD=password
      - K8S_MINIKUBE_TOKEN=k8s_minikube_token
    ports:
      - 7000:7000
```

### CI - Build/Deploy

Automatic build and deploy start only when you push new tag.

> Version in package.json **must** follow the tag of the push.
