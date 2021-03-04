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

Requests to be made with `Authorization` header, in the format `Bearer <token>`.
Query Parameters:
`limitNum (type:int) optional: next (type:next string-- you can get this from a previous GET request of /posts) optional: previous(type: previous string -- -- you can get this from a previous GET request of /posts)`
Returns:

```
{
    "message": "Posts successfully queried.",
     "paginatedPosts": {
        "results": [

        {
            "_id": <id>,
            "tags": <array_of_tags>,
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
}
```

<<<<<<< HEAD
<<<<<<< HEAD

<<<<<<< HEAD

### /signup

=======

> > > > > > > # d9b97f30fa0f8d1b92ea23df0928e908b9811c06
> > > > > > >
> > > > > > > # d540e6de8874e3f0093ac013744f3d063056e14c

## Authorization

> > > > > > > e84bbb0f177c3086a893de13961364e6eb1d437c

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
    "userType": "student" or "club"
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

Request parameter, eventId: \_id of event to attend

Put the following fields in the body of the request:

```
{
    "userType": "student" or "club"
}
```

### POST /events/:eventId/cancel

Post request: students and clubs can cancel attendance for event

Put the following fields in the body of the request:

```
{
    "userType": "student" or "club"
    "eventId": _id of event to cancel
}
```

### GET /events/going

Get request: students and clubs can return list of events they have indicated interest in

Put the following fields in the body of the request:

```
{
    "userType": "student" or "club"

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
    "userType": "student" or "club"

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
    "userType":"club",
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
NOTE: for adding tags and clubs, you only need to include the tags you would like to add into the user tags, and
if you want to remove a tag/club, you can pass in a "rm<tag/club>" for example, "rmlaw" will remove the law tag

```
{
    "name": <name>,
    "email": <email>,
    "major": <major>,
    "year": <year>,
    "tags": [array of strings],
    "clubs":[array of strings],
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

## POST /club/resources

In:Authorization`header, in the format`Bearer <token>`
Request Body: files with key 'file'
Returns: if Successful:

```
{
    "success": true,
    "files": [
        {
            "file": <fileName>,
            "fileType": "text/plain" or "application/vnd.openxmlformats-officedocument.presentationml.presentation" or "application/pdf"
        },
        ... other files
    ],
    "fileUrls": [
        {
            "ETag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
            "Location": <URL OF THE LOCATION OF THE FILE IN AWS>,
            "key": <FILE KEY>,
            "Key": <FILE KEY>,
            "Bucket": "club-resources-embark"
        },
        ... other files
    ]
}
```

### POST /club/profile/image?pictureType= <either profile or cover>

In: `Authorization` header, in the format `Bearer <token>`
Request body: image file with key 'image'

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

### POST /student/following

### POST /club/following

In: Authorization header, in the format Bearer <token>
Request Body:

```
{
    userEmail: ""
    clubEmail: ""
}
```

Returns:

```
{
    followedClubs: ""
}
```

### GET /student/following

### GET /club/following

In: Authorization header, in the format Bearer <token>
Request Body:

```
{
    userEmail: ""
}
```

Returns:

```
{
    followedClubs: ""
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
        "userLikes": [
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

### GET /post/me

In: Authorization header, in the format Bearer <token>
Request Body:

```
{
    userEmail: "",
    accountType: "student"
}
```

Returns: a list of post IDs

```
{
    "posts": ""
}
```
