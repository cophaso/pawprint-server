# Pawprint API Server

PawPrint is a great way for your company to keep up with the office pups! The app solves the issue of managing dogs in an office. You can schedule when your dog will be in the office and schedule any services (vet, grooming, daycare) to make sure the on-call third parties are scheduled for those days.

Live: 
client: https://pawprint-app.now.sh/
server: https://guarded-peak-83816.herokuapp.com/ 

Server Repo: https://github.com/cophaso/pawprint-server

Team: Kayla Graham, Crystal Ophaso, Amber Meritt

## Technologies Used

Express/Postgresql/Nodejs/Postman/DBeaver

## API Endpoints/Documentation

https://guarded-peak-83816.herokuapp.com/api/users</br>
https://guarded-peak-83816.herokuapp.com/api/auth</br>
https://guarded-peak-83816.herokuapp.com/api/pups</br>
https://guarded-peak-83816.herokuapp.com/api/pup-services</br>


```conf
# - `Example JSON of GET /pups/${pupId}` -
{
    "id": 1,
    "pup_name": "Cocoa",
    "parent_id": 1,
    "breed": "Lab",
    "allergies": "Peanuts",
    "hobbies": "Plays Ball",
    "image_url": "https://i.pinimg.com/originals/63/45/38/634538e61eb1fae4d51c345f6b47f376.jpg",
    "services": {
        "id": 1,
        "appt_date": "2019-12-24",
        "service_type": "Grooming",
        "note": "Loves bath time"
    },
    "parent": {
        "id": 1,
        "name": "Amber",
        "email": "amber@test.com"
    }
}
```



## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests in watch mode `npm test`

Migrate the dev database `npm run migrate`

Migrate the test database `npm run migrate:test`

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```
