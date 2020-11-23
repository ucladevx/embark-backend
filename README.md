## Embark Backend

To run:
* Clone the repository
* Run `docker-compose up --build`. If you've modified the docker files, run `docker-compose down && docker-compose up --build`.

### /posts
Requests to be made with `Authorization` header, in the format `Bearer <token>`.

##### POST /posts/create

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
    "email": <author_email>
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