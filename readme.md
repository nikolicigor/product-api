# Product API README

This repository contains a simple Product API built with Node.js, Express, and MongoDB. The application provides a GraphQL endpoint for querying and manipulating product data.

## Getting Started

### Prerequisites

- Docker installed on your machine
- Node.js installed (for local development)
- MongoDB instance (can be run using Docker, see below)

### Run app with Docker

```bash
docker-compose up
```

### Product synchronization mutation

```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
  "query": "mutation { syncProducts }"
}'
```

### Fetch product

```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
  "query": "query ($productId: ID!) { product(_id: $productId) { name } }",
  "variables": {
    "productId": "65ad52758879247538df63fd"
  }
}'
```
