# Embark Backend

To run:

- Clone the repository
- Run `docker-compose up --build`. If you've modified the docker files, run `docker-compose down && docker-compose up --build`.

### /posts

Requests to be made with `Authorization` header, in the format `Bearer <token>`.

##### POST /posts

```
{
    "title": <title>,
    "body": "<body>,
    "timestamp": <new_Date()>,
    "tags": <tech/law/medicine/etc>,
}
```

Returns:

```
{
    "message": "Post successfully created.",
    "title": <title>,
    "body": <body>,
    "timestamp": <Date_object>,
    "tags": <array_of_tags>,
    "email": <author_email>,
    "_id": <post_id>
}
```

##### GET /posts

Nothing required in request except Authorization header.

Returns:

```
{
    "message": "Posts successfully queried.",
    "posts": [
        {
            "tags": <array_of_tags>,
            "_id": <id>,
            "title": <title>,
            "body": <body>,
            "timestamp": <Date_object>,
            "authorEmail": <email>,
            "__v": <v>
        },
        ...
        // array of such posts
    ]
}
```

## Authorization

### auth/signup

Post Request:
Put the following fields in the body of the request:
{
"name":string,
"email":unique string,
"password":string, must be 8 characters, with at least 1 Uppercase, 1 Lowercase, and one special character,
userType:"club" or "student"
}
Returns (if successful):

```
{
    "auth":true,
    "token": <token>
}
```

### auth/signin

Requests to be made with `Authorization` header, in the format `Bearer <token>`.
Request body:

```
{
    "email":string,
    "password":string,
    "userType":"club" OR "student"
}
```

Returns (if successful):

```
{
    token:<token>
}
```

### auth/google

Post request:
Put the following fields in the body of the request:

```
{
"type": "signin" or "signup"
"user": "student" or "club"
}
```

### auth/linkedin

Post request:
Put the following fields in the body of the request:

```
{
"type": "signin" or "signup"
"user": "student" or "club"
}
```

## Events

### GET /events/discover

Get request: for clubs and students to discover events by tags/clubs followed
Put the following fields in the body of the request:

```
{
    "user": "student" or "club"
}
```

Returns:

```
{
    events: [events]
}
```

### POST /events/:eventId/attend

Post request: students and clubs can indicate interest in event
Put the following fields in the body of the request:

```
{
    "user": "student" or "club"
    "eventId": _id of event to attend
}
```

### POST /events/:eventId/cancel

Post request: students and clubs can cancel attendance for event
Put the following fields in the body of the request:

```
{
    "user": "student" or "club"
    "eventId": _id of event to cancel
}
```

### GET /events/going

Get request: students and clubs can return list of events they have indicated interest in
Put the following fields in the body of the request:

```
{
    "user": "student" or "club"

}
```

Returns:

```
{
    events: [events]
}
```

### GET /events/me

Get request: clubs can see all events they have hosted/are hosting
Put the following fields in the body of the request:

```
{
    "user": "student" or "club"

}
```

Returns:

```
{
    events: [events]
}
```

### POST /events/create

Post request: clubs can create event
Put the following fields in the body of the request:

```
{
    "name": String,
    "date": Date
    "venue": String,
    "organizerName": String,
    "organizerEmail": String,
    "tags": [String],
    "desc": String
}
```

Returns:

```
{
    events: [events]
}
```

## /profile

All requests to be made with `Authorization` header, in the format `Bearer <token>`.

### GET /student/profile

In: `Authorization` header, in the format `Bearer <token>`
Returns:

```
 "student": {
        "posts": [],
        "tags": [],
        "savedPosts": [],
        "clubs": [],
        "_id": "",
        "name": "",
        "email": "",
        "password": "",
        "major": "",
        "year": 2024,
        "bio": "",
        "profilePicURL": "",
        "coverPicURL": "",
        "linkedIn": "",
        "__v": 0
    }
```

### Get /club/profile

In:In: `Authorization` header, in the format `Bearer <token>`
Returns:

```
"club": {
        "tags": [],
        "_id": "6008b841a99a7e438812e08b",
        "name": "club1",
        "email": "club1@gmail.com",
        "password": "$2a$10$pSTtY114EVpLLmpQrbwskO1qNGAMaCB8Tk9YCQWY5AArbsTPpunsi",
        "website": "",
        "description": "a club one",
        "profilePicURL": "",
        "coverPicURL": "",
        "__v": 0
    }
```

##### POST /student/profile

Edit Student profile

In: `Authorization` header, in the format `Bearer <token>`
Request Body (all fields are optional):

```
{
    "name": <name>,
    "email": <email>,
    "major": <major>,
    "year": <year>,
    "tags": <tags>,
    "bio":<bioString>,
    "linkedIn":<linkedIn>
}
```

Returns:

```
"returnedStudent":
{
        "posts": [],
        "tags": [],
        "savedPosts": [],
        "clubs": [],
        "_id": "",
        "name": "",
        "email": "",
        "password": <hashed password>,
        "major": "",
        "year": 2024,
        "bio": "",
        "profilePicURL": "",
        "coverPicURL": "",
        "linkedIn": "",
}
```

##### POST /club/profile

Edit Student profile

In: `Authorization` header, in the format `Bearer <token>`
Request Body (all fields are optional):

```
{
    "name": <name>,
    "email": <email>,
    "major": <major>,
    "year": <year>,
    "website":<website>,
    "description":<descriptionString>,
    "linkedIn":<linkedIn>
}
```

Returns:

```
 "returnedClub": {
        "tags": [],
        "_id": "",
        "name": "",
        "email": "",
        "password": "hashed password",
        "website": "",
        "description": "",
        "profilePicURL": "",
        "coverPicURL": "",
        "__v": 0
    }
```

##### POST /club/profile/image?pictureType= <either profile or cover>

In: `Authorization` header, in the format `Bearer <token>`
Request body: nothing

Returns (updates either profile picture or cover picture depending on what you query):

```
"returnedClub": {
        "tags": [],
        "_id": "",
        "name": "",
        "email": "",
        "password": "",
        "website": "",
        "description": "",
        "profilePicURL": "",
        "coverPicURL": ""
    }
```

##### POST /student/profile/image?pictureType= <either profile or cover>

In: `Authorization` header, in the format `Bearer <token>`
Request body: nothing

Returns (updates either profile picture or cover picture depending on what you query):

```
 "returnedStudent": {
        "posts": [],
        "tags": [],
        "savedPosts": [],
        "clubs": [],
        "_id": "",
        "name": "",
        "email": "",
        "password": "",
        "major": "",
        "year": 2024,
        "bio": "",
        "profilePicURL": "",
        "coverPicURL": "",
        "linkedIn": ""
    }
```
