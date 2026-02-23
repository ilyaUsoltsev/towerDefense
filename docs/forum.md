# API — Форума (Топики, Комментарии, Ответы, Реакции)

**Базовый URL**: `http://localhost:3001/api` 

Авторизация проверяется через middleware (поле `req.user.id`).

**Общие коды ошибок**:
- 403 — не авторизован или нет прав
- 404 — сущность не найдена
- 400 — неверные входные данные
- 500 — ошибка сервера / базы данных

## 1. Топики (Topics)

| Метод   | Путь                  | Описание                              | Требуется авторизация | Тело запроса (JSON)                          | Пример curl                                                                 |
|---------|-----------------------|---------------------------------------|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| GET     | `/topics`             | Список всех топиков (с пагинацией)    | Да                     | —                                            | `curl "http://localhost:3001/api/topics?page=1&limit=10"`                   |
| GET     | `/topics/:id`         | Получить один топик + комментарии     | Да                     | —                                            | `curl "http://localhost:3001/api/topics/42"`                                |
| POST    | `/topics`             | Создать новый топик                   | Да                     | `{ "title": "...", "content": "..." }`       | `curl -X POST .../topics -d '{"title":"Новый пост","content":"Текст"}'`     |
| PUT     | `/topics/:id`         | Обновить топик (только автор)         | Да                     | `{ "title": "...", "content": "..." }`       | `curl -X PUT .../topics/42 -d '{"title":"Исправлено"}'`                     |
| DELETE  | `/topics/:id`         | Удалить топик (только автор)          | Да                     | —                                            | `curl -X DELETE http://localhost:3001/api/topics/42`                        |

**Ответ GET /topics** (пример):
```json
{
  "topics": [ { "id": 42, "title": "...", "content": "...", "userId": 5, ... } ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

## 2. Комментарии (Comments)

| Метод   | Путь                                      | Описание                                      | Требуется авторизация | Тело запроса (JSON)                          | Пример curl                                                                 |
|---------|-------------------------------------------|-----------------------------------------------|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| GET     | `/topics/:topicId/comments`               | Получить все комментарии к топику (с ответами и реакциями) | Да                     | —                                            | `curl "http://localhost:3001/api/topics/42/comments" -H "Authorization: Bearer <токен>"` |
| POST    | `/topics/:topicId/comments`               | Создать новый комментарий к топику            | Да                     | `{ "content": "Текст комментария" }`         | `curl -X POST http://localhost:3001/api/topics/42/comments -H "Content-Type: application/json" -H "Authorization: Bearer <токен>" -d '{"content":"Отличная статья!"}'` |
| PUT     | `/topics/:topicId/comments/:id`           | Обновить текст своего комментария             | Да                     | `{ "content": "Новый текст..." }`            | `curl -X PUT http://localhost:3001/api/topics/42/comments/123 -H "Content-Type: application/json" -H "Authorization: Bearer <токен>" -d '{"content":"Исправил опечатку"}'` |
| DELETE  | `/topics/:topicId/comments/:id`           | Удалить свой комментарий                      | Да                     | —                                            | `curl -X DELETE http://localhost:3001/api/topics/42/comments/123 -H "Authorization: Bearer <токен>"` |

**Ответ GET /topics/:topicId/comments
```json

[
  {
    "id": 123,
    "content": "Первый комментарий",
    "userId": 5,
    "topicId": 42,
    "createdAt": "2026-02-16T14:35:22.123Z",
    "updatedAt": "2026-02-16T14:35:22.123Z",
    "replies": [
      {
        "id": 124,
        "content": "Ответ на комментарий",
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


## 3. Ответы на комментарии (Replies)

| Метод   | Путь                               | Описание                                      | Требуется авторизация | Тело запроса (JSON)                          | Пример curl                                                                 |
|---------|------------------------------------|-----------------------------------------------|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| GET     | `/comments/:commentId/replies`     | Получить все ответы на конкретный комментарий | Да                     | —                                            | `curl "http://localhost:3001/api/comments/55/replies" -H "Authorization: Bearer <токен>"` |
| POST    | `/comments/:commentId/replies`     | Создать ответ на существующий комментарий     | Да                     | `{ "content": "Текст ответа" }`              | `curl -X POST http://localhost:3001/api/comments/55/replies -H "Content-Type: application/json" -H "Authorization: Bearer <токен>" -d '{"content":"Полностью согласен!"}'` |

**Ответ GET /comments/:commentId/replies
```json

[
  {
    "id": 124,
    "content": "Согласен, очень полезный разбор",
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
    "content": "Спасибо за дополнение!",
    "userId": 10,
    "commentId": 55,
    "createdAt": "2026-02-16T15:20:30.000Z",
    "reactions": []
  }
]
```

## 4. Реакции (Reactions)

| Метод   | Путь                                           | Описание                                            | Требуется авторизация | Тело запроса (JSON)                          | Пример curl                                                                 |
|---------|------------------------------------------------|-----------------------------------------------------|------------------------|----------------------------------------------|-----------------------------------------------------------------------------|
| POST    | `/comments/:commentId/reactions`               | Поставить или убрать реакцию на комментарий (toggle) | Да                     | `{ "type": "like" }`                         | `curl -X POST http://localhost:3001/api/comments/123/reactions -H "Content-Type: application/json" -H "Authorization: Bearer <токен>" -d '{"type":"like"}'` |
| POST    | `/replies/:replyId/reactions`                  | Поставить или убрать реакцию на ответ (toggle)      | Да                     | `{ "type": "heart" }`                        | `curl -X POST http://localhost:3001/api/replies/456/reactions -H "Content-Type: application/json" -H "Authorization: Bearer <токен>" -d '{"type":"heart"}'` |
| GET     | `/comments/:commentId/reactions/count`         | Получить количество реакций по типам для комментария | Да                     | —                                            | `curl "http://localhost:3001/api/comments/123/reactions/count" -H "Authorization: Bearer <токен>"` |
| GET     | `/replies/:replyId/reactions/count`            | Получить количество реакций по типам для ответа     | Да                     | —                                            | `curl "http://localhost:3001/api/replies/456/reactions/count" -H "Authorization: Bearer <токен>"` |

**Ответ GET /.../reactions/count
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