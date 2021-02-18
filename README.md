# Embark Backend

To run:

- Clone the repository
- Run `docker-compose up --build`. If you've modified the docker files, run `docker-compose down && docker-compose up --build`.

## auth/signup
Post Request:
    Put the following fields in the body of the request:
```
{
    "name":string,
    "email":unique string,
    "password": string, must be 8 characters, with at least 1 Uppercase, 1 Lowercase, and one special character,
    userType: "club" or "student"
}
```
Returns (if successful):
```
{
    "auth":true,
    "token": <token>
}
```
## auth/signin

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

## /posts
Requests to be made with `Authorization` header, in the format `Bearer <token>`.

### POST /posts
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

### GET /posts

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
<<<<<<< HEAD

<<<<<<< HEAD
### /signup
=======
>>>>>>> d9b97f30fa0f8d1b92ea23df0928e908b9811c06
=======
>>>>>>> d540e6de8874e3f0093ac013744f3d063056e14c
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

# auth/signin

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

# auth/google

Post request:
Put the following fields in the body of the request:
{
"type": "signin" or "signup"
"user": "student" or "club"
}

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
### GET /club/profile
In: `Authorization` header, in the format `Bearer <token>`

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
### POST /student/profile

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
### POST /club/profile

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
### POST /club/profile/image?pictureType= <either profile or cover>

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

## Likes
### GET /post/likes
In: Authorization header, in the format Bearer <token> 
Request Body:
```
{
    authorEmail: "",
    post_id: ""
}
```

Returns:
```
{
    post_id: ""
    likes: 1
}
```
### POST /post/likes
In: Authorization header, in the format Bearer <token> 
Request Body: 
```
{
    post_id: "",
    authorEmail: ""
}
```
Returns:
```
{
    "message": "incremented post like",
    "post": {
        "tags": [
            ""
        ],
        "_id": "",
        "title": "",
        "body": "",
        "timestamp": "",
        "authorEmail": "",
        "likes": ,
        "comments": "",
        "__v": ""
    }
}
```

## /post/likes
### GET /post/likes
In: Authorization header, in the format Bearer <token> 
Request Body: 
```
{
    post_id: ""
}
```
Returns:
```
{
    "message": "Get post comments",
    "comments": [
        {
            "_id": "",
            "authorEmail": "",
            "body": "",
            "date": ""
        }
    ]
}
```
## /post/comments

### GET /post/comments
In: Authorization header, in the format Bearer <token> 
Request Body: 
```
{
    post_id: ""
}
```
Returns: 
```
    "message": "Get post comments",
    "comments": [
        {
            "_id": "",
            "authorEmail": "",
            "body": "",
            "date": ""
        }
    ]
```

### POST /post/comments
In: Authorization header, in the format Bearer <token> 
Request Body: 
```
{
    authorEmail: "",
    post_id: "",
    comment: ""
}
```
Returns: 
```
    "comments": [
        {
            "_id": "",
            "authorEmail": "",
            "body": "",
            "date": ""
        }
    ]
```

## /post/saved
### GET /post/saved
In: Authorization header, in the format Bearer <token> 
Request Body: 
```
{
    email: ""
    accountType: ""
}
```
Returns: an array of posts IDs
```
{
    "message": "Student Saved Posts successfully queried.",
    "posts": [
        ""
    ]
}
```
or
```
{
    "message": "Club Saved Posts successfully queried.",
    "posts": [
        ""
    ]
}
```

### POST /post/saved
In: Authorization header, in the format Bearer <token> 
Request Body:
```
{
    post_id: "",
    email: "",
    accountType: ""
}
```

Returns:
```
{
    "message": "student created saved post"
}
```
or 
```
{
    "message": "club created saved post"
}
```