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

## Queries

### Fetch single product by ID

```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
  "query": "query ($productId: ID!) { product(_id: $productId) { name producer { name } } }",
  "variables": {
    "productId": "65afc9c024f6c50be92fa3ea"
  }
}'
```

### Fetch products by producer ID

```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
  "query": "query ($producerId: ID!) { productsByProducer(_id: $producerId) { name } }",
  "variables": {
    "producerId": "65afc9bff2410942a6567ef5"
  }
}'
```

## Mutations

### Create multiple products

```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
    "query": "mutation ($products: [ProductInput]) { createProducts(products: $products) { name } }",
    "variables": {
        "products": [
            {
                "vintage": "2022",
                "name": "Example Product",
                "producerId": "65afc9bff2410942a6567ef5"
            },
            {
                "vintage": "2021",
                "name": "Another Product",
                "producerId": "65afc9bff2410942a6567ef5"
            }

        ]
    }
}'
```

### Update single product

```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
    "query": "mutation ($productId: ID!, $vintage: String, $name: String, $producerId: ID) { updateProduct(_id: $productId, vintage: $vintage, name: $name, producerId: $producerId) { name } }",
    "variables": {
        "productId": "65afc9c024f6c50be92fa3ea",
        "vintage": "2023",
        "name": "Updated Product",
        "producerId": "65afc9c024f6c50be92fa3ea"
    }
}'
```

### Delete multiple products

```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
    "query": "mutation ($productIds: [ID]) { deleteProducts(ids: $productIds) }",
    "variables": {
        "productIds": [
            "65afc9c024f6c50be92fa3ea"
        ]
    }
}'
```

### Product synchronization mutation

```bash
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{
  "query": "mutation { syncProducts }"
}'
```
