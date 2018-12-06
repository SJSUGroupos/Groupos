





if  __name__ == "main":

    obj = str(
    {
        "_id": {
            "$oid": "5bca8d68a237bf0015e131f8"
        },
        "firstName": "Bradley",
        "lastName": "Kreager",
        "username": "a",
        "createdDate": {
            "$date": "2018-10-20T02:05:28.553Z"
        },
        "hash": "$2a$10$hINOOJy1u/qwOR3.y1CGCe.YJQsiZBrKq3fBr2aUa1NNGJoJcx/t6",
        "coursework": [
            "CMPE 102 - Assembly Language Programming"
        ],
        "major": "BS, Computer Engineering",
        "avatar": "/src/assets/images/5bca8d68a237bf0015e131f8.jpeg",
        "email": "bradley.kreager@sjsu.edu",
        "availabilities": {
            "monday": [
                {
                    "startTime": 13,
                    "endTime": 19.066666666666666
                },
                {
                    "startTime": 14,
                    "endTime": 17
                },
                {
                    "startTime": 1,
                    "endTime": 12
                }
            ],
            "tuesday": [],
            "wednesday": [],
            "thursday": [],
            "friday": [],
            "saturday": [],
            "sunday": []
        }
    })

print obj
