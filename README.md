# overview

A backend service for managing policy information, users, CSV uploads, and scheduled messages.

The project currently contains the main API services in a single server. It supports querying policy information, getting aggregated user data, uploading CSV files, and scheduling messages.

# Architecture

<img width="1030" height="592" alt="Screenshot 2026-09-26 at 11 04 31 PM" src="https://github.com/user-attachments/assets/201f8ddd-c994-4506-9e22-c383b942d0cd" />

# APIs

1. Get Policy Information

Endpoint

POST http://localhost:3000/policyInfo

Finds policy information using the username.

Request body

{
"username": "GABRIEL CRUZ"
}

2. Get All Users

POST http://localhost:3000/allUser?page=5&limit=33

Returns aggregated policy information for each user.

Query parameters : page ,limit

Example

http://localhost:3000/allUser?page=5&limit=33

3. Upload CSV Data

Endpoint

POST http://localhost:3000/upload

Used to upload CSV data to the system.

The request should be sent as multipart/form-data.

File field name

file

Example using cURL:

curl -X POST http://localhost:3000/upload -F "file=@data.csv"

4. Schedule a Message

Endpoint

POST http://localhost:3000/message

Schedules a message for the provided date and time.

Request body

{
"message": "hello!",
"time": "14:27",
"date": "09-26-26"
}

The scheduled message is stored as a pending message and is picked up by the scheduled-message worker when its scheduled time is reached.

Base URL

For local development:

http://localhost:3000
