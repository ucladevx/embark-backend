## Embark Backend

To run:
* Clone the repository
* Run `docker-compose up --build`. If you've modified the docker files, run `docker-compose down && docker-compose up --build`.

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
### /signup
Required: Name, Email, Password (Password must be 8 characters, must have one Uppercase, one Lowercase, and one special character)
Returns (if successful):
```
{
    "auth":true,
    "token": <token>
}
```
# /signin
Requests to be made with `Authorization` header, in the format `Bearer <token>`.
Required: Email, Password

Returns (if successful):
```
{
    token:<token>
}
```

### /profile
Requests to be made with `Authorization` header, in the format `Bearer <token>`.

##### POST /profile
Edit Student profile

In: Authorization header, fields such as:
```
{
    "name": <name>,
    "email": <email>,
    "major": <major>,
    "year": <year>,
    "tags": <tags>,
    "bio":<bioString>,
    profilePicURL:<profilePicURL>,
    coverPicURL:<coverPicURL>,
    linkedIn:<linkedIn>
}
```
Returns:
Redirects to profile page

