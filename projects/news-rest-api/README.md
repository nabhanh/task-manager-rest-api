# News Rest API

## Description

This is a simple REST API for news. It allows you to fetch news articles, mark them as read and save them as favorites.

## Installation

Follow the steps given in the Project Readme to install the project. It's configured with pnpm workspaces, so you can run `pnpm install` in the root folder to install all dependencies.

## Usage

### Auth

**Register**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"email":"email", "password":"password", "name":"name"}' http://localhost:3000/auth/register -v
```

The API uses JWT for authentication. To get a token, you need to send a POST request to `/auth/login` with the following body:

**Login**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"email":"nabhanhanif2000@gmail.com", "password":"password"}' http://127.0.0.1:3000/auth/login -v
```

## Authentication

Like stated this API uses JWT tokens for Authentication. To authorize a request, you need to send the token in the `Authorization` header. The token should be prefixed with `Bearer`.

```bash
curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjkxMzk1NzA3LCJleHAiOjE2OTE0Mzg5MDd9.tR0kRNsZWYyT_aJ1aQiQPmCkhn5FVaFM-LPrlD64Wws"   http://127.0.0.1:3000/news/
```

## Endpoints

### News

**Get News**

```bash
$ GET /news
```

**Mark News as Read**

```bash
$ POST /news/:id/read
```

**Get Read News**

```bash
$ GET /news/read
```

**Mark News as Favorite**

```bash
$ POST /news/:id/favorite
```

**Get Favorite News**

```bash
$ GET /news/favorites
```

### Preferences

**Get Preferences**

```bash
$ GET /preferences
```

**Update Preferences**

```bash
$ PUT /preferences
```

schema

```json
{
  "newsSources": ["string"],
  "newsCategories": ["string"]
}
```
