# Forum API (Topics, Comments, Replies, Reactions)

**Base URL**: `http://localhost:3001/api` 

Authorization is checked via middleware (the `req.user.id` field).

**Common error codes**:
- 403 — not authorized or insufficient permissions
- 404 — entity not found
- 400 — invalid input data
- 500 — server / database error

## 1. Topics

| Method  | Path                  | Description                            | Auth required | Request body (JSON)                          | curl example                                                                 |
|---------|-----------------------|-----------------------------------------|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| GET     | `/topics`             | List of all topics (paginated)          | Yes                     | —                                            | `curl "http://localhost:3001/api/topics?page=1&limit=10"`                   |
| GET     | `/topics/:id`         | Get a single topic + comments           | Yes                     | —                                            | `curl "http://localhost:3001/api/topics/42"`                                |
| POST    | `/topics`             | Create a new topic                      | Yes                     | `{ "title": "...", "content": "..." }`       | `curl -X POST .../topics -d '{"title":"New post","content":"Text"}'`     |
| PUT     | `/topics/:id`         | Update a topic (author only)            | Yes                     | `{ "title": "...", "content": "..." }`       | `curl -X PUT .../topics/42 -d '{"title":"Fixed"}'`                     |
| DELETE  | `/topics/:id`         | Delete a topic (author only)            | Yes                     | —                                            | `curl -X DELETE http://localhost:3001/api/topics/42`                        |

**Response for GET /topics** (example):
```json
{
  "topics": [ { "id": 42, "title": "...", "content": "...", "userId": 5, ... } ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

## 2. Comments

| Method  | Path                                      | Description                                      | Auth required | Request body (JSON)                          | curl example                                                                 |
|---------|-------------------------------------------|-----------------------------------------------|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| GET     | `/topics/:topicId/comments`               | Get all comments for a topic (with replies and reactions) | Yes                     | —                                            | `curl "http://localhost:3001/api/topics/42/comments" -H "Authorization: Bearer <token>"` |
| POST    | `/topics/:topicId/comments`               | Create a new comment on a topic            | Yes                     | `{ "content": "Comment text" }`         | `curl -X POST http://localhost:3001/api/topics/42/comments -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"content":"Great article!"}'` |
| PUT     | `/topics/:topicId/comments/:id`           | Update the text of your own comment             | Yes                     | `{ "content": "New text..." }`            | `curl -X PUT http://localhost:3001/api/topics/42/comments/123 -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"content":"Fixed a typo"}'` |
| DELETE  | `/topics/:topicId/comments/:id`           | Delete your own comment                      | Yes                     | —                                            | `curl -X DELETE http://localhost:3001/api/topics/42/comments/123 -H "Authorization: Bearer <token>"` |

**Response for GET /topics/:topicId/comments
```json

[
  {
    "id": 123,
    "content": "First comment",
    "userId": 5,
    "topicId": 42,
    "createdAt": "2026-02-16T14:35:22.123Z",
    "updatedAt": "2026-02-16T14:35:22.123Z",
    "replies": [
      {
        "id": 124,
        "content": "Reply to comment",
        "userId": 7,
        "commentId": 123,
        "createdAt": "2026-02-16T14:40:10.456Z",
        "reactions": [
          { "type": "like", "userId": 8 },
          { "type": "heart", "userId": 9 }
        ]
      }
    ],
    "reactions": [
      { "type": "like", "userId": 10 },
      { "type": "wow", "userId": 11 }
    ]
  },
  ...
]
```


## 3. Replies to comments

| Method  | Path                               | Description                                      | Auth required | Request body (JSON)                          | curl example                                                                 |
|---------|------------------------------------|-----------------------------------------------|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| GET     | `/comments/:commentId/replies`     | Get all replies to a specific comment | Yes                     | —                                            | `curl "http://localhost:3001/api/comments/55/replies" -H "Authorization: Bearer <token>"` |
| POST    | `/comments/:commentId/replies`     | Create a reply to an existing comment     | Yes                     | `{ "content": "Reply text" }`              | `curl -X POST http://localhost:3001/api/comments/55/replies -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"content":"Completely agree!"}'` |

**Response for GET /comments/:commentId/replies
```json

[
  {
    "id": 124,
    "content": "Agreed, a very useful breakdown",
    "userId": 7,
    "commentId": 55,
    "createdAt": "2026-02-16T15:12:45.678Z",
    "updatedAt": "2026-02-16T15:12:45.678Z",
    "reactions": [
      {
        "type": "like",
        "userId": 8,
        "createdAt": "2026-02-16T15:15:00.000Z"
      },
      {
        "type": "heart",
        "userId": 9,
        "createdAt": "2026-02-16T15:16:20.000Z"
      }
    ]
  },
  {
    "id": 125,
    "content": "Thanks for the addition!",
    "userId": 10,
    "commentId": 55,
    "createdAt": "2026-02-16T15:20:30.000Z",
    "reactions": []
  }
]
```

## 4. Reactions

| Method  | Path                                           | Description                                            | Auth required | Request body (JSON)                          | curl example                                                                 |
|---------|------------------------------------------------|-----------------------------------------------------|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| POST    | `/comments/:commentId/reactions`               | Add or remove a reaction on a comment (toggle) | Yes                     | `{ "type": "like" }`                         | `curl -X POST http://localhost:3001/api/comments/123/reactions -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"type":"like"}'` |
| POST    | `/replies/:replyId/reactions`                  | Add or remove a reaction on a reply (toggle)      | Yes                     | `{ "type": "heart" }`                        | `curl -X POST http://localhost:3001/api/replies/456/reactions -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"type":"heart"}'` |
| GET     | `/comments/:commentId/reactions/count`         | Get reaction counts by type for a comment | Yes                     | —                                            | `curl "http://localhost:3001/api/comments/123/reactions/count" -H "Authorization: Bearer <token>"` |
| GET     | `/replies/:replyId/reactions/count`            | Get reaction counts by type for a reply     | Yes                     | —                                            | `curl "http://localhost:3001/api/replies/456/reactions/count" -H "Authorization: Bearer <token>"` |

**Response for GET /.../reactions/count
```json

[
  {
    "type": "like",
    "count": 17
  },
  {
    "type": "heart",
    "count": 8
  },
  {
    "type": "wow",
    "count": 3
  }
]
```