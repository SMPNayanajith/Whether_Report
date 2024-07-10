Postman API collection

REGISTER-http://localhost:3001/api/users
{
  "email": "user1@example.com",
  "password": "password123",
  "location": "New York, US"
}

LOGIN-http://localhost:3001/api/users/login

{
  "email": "user1@example.com",
  "password": "password123"
}

UPDATE-http://localhost:3001/api/users/user1@example.com

{
  "location": "San Francisco, US"
}

GET-http://localhost:3001/api/users/user1@example.com/weather/2024-07-10
