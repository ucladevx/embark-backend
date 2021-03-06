# Embark Backend

To run:

- Clone the repository
- Run `docker-compose up --build`. If you've modified the docker files, run `docker-compose down && docker-compose up --build`.

## auth/signup

Post Request:
Put the following fields in the body of the request:

```
{
    "firstName":string,
    "lastName":string,
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
    "post": {
        "tags": <array_of_tags>,
        "userLikes": <array_of_users_that_like_the_post>,
        "_id": <post_id>,
        "title": <post_title>,
        "body": <post_body>,
        "timestamp": <Date() object>,
        "authorEmail": <author_email>, # possibly author ID in the future
        "authorName": <author_name>,
        "likes": <num_likes>,
        "comments": <array_of_comments>
        "__v": 0
    }
}
```

### GET /posts

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

### GET /student/getClubResources

In: `Authorization` header, in the format `Bearer <token>`
Request Body: clubID:
Returns:

```
"success": true,
    "resources": [

        {
            "Location": "https://club-resources-embark.s3.amazonaws.com/1619066278523pset1.pdf",
            "Key": "1619066278523pset1.pdf",
            "Bucket": "club-resources-embark",
            "Name": "pset1.pdf",
            "userNamed": "myFile" <-- what they named it
        }
        , ...more resources
    ],
    "embededlinks": [
        {
            "link": "hello",
            "userNamed": "myLink"
        }
        , ... more embededlinks

    ]
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
Query: linkFile=link (uploading a link) or linkFile=file (uploading a file)
Query: userNamed = string name that the user named the file
Request Body (file): files with key 'file' if uploading file (uses Form Data)
Request Body: string link given like so: link: "string link"
Returns: if Successful for File:

```
{
    "success": true,
    "fileUrls": [
        {
            "Location": "<location in AWS S3 string>",
            "Key": <key name in AWS S3> ex. "1617248893413club.pdf",
            "Name": <file name> ex. "club.pdf"
            "userNamed": <string name that user gave>
        }
    ]
}
```

Returns: if Successful for Link:

```
{
    "success": true,
    "fileUrls": {
        "link": <link>,
        "userNamed": <string name user Gave>
    }
}
```

## GET /club/resources

In: Authorization`header, in the format`Bearer <token>`
Request Body: Nothing
Returns: if Successful:

```
{
    "success": true,
    "resources": [
        {
            "Location": <location URL as a string>,
            "Key": <key name in AWS S3> ex. "1617244725547club.pdf",
            "Bucket": <bucket name> ex. "club-resources-embark",
            "Name": <file name> ex. "club.pdf"
        }
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
    post_id: ""
}
```

Returns:
```
{
    post_id: "",
    likes: 1,
    likedUsers: ["test@gmail.com"]
}
```

### POST /post/likes
Adds a like to a given post, or removes a like if user already liked the post.

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
    "message": "Removed user's like",
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

### GET /posts/saved

In: Authorization header, in the format Bearer <token>
Request Body:

```
{
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

### POST /posts/saved
Saves a post if user has not already done so, and removes a savedpost if user already
has it saved. 

In: Authorization header, in the format Bearer <token>
Request Body:

```
{
    post_id: "",
    accountType: ""
}
```

Returns:

```
{
    "message": "Student: added post to saved posts"
}
```

or

```
{
    "message": "Club: removed post from saved posts"
}
```

### GET /post/me

In: Authorization header, in the format Bearer <token>

Request Body:

```
{
    accountType: "student"
}
```

Returns: a list of post IDs

```
{
    "posts": ""
}
```

### GET /search

In: Authorization header, in the format Bearer <token>

Request Body:

```
{
    searchString: "",
}
```

Returns: A list with the queries, and the number of search results.
Each query has name, mongo id, and account type.

```
{
    "queries": [
        {
            "name": "embark",
            "id": "60651dcf84687500c42c07ad",
            "accountType": "club"
        },
    ],
    "numQueries": 1
}
```
