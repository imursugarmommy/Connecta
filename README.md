# Connecta

install packages on server and client side

```bash
cd client
npm install
```

```bash
cd server
npm install
```

create .env file in the **server** directory and add the following

```.env
DB_USERNAME = "urUsername"
DB_PASSWORD = "urPrivatePassword"
DB_DATABASE = "urDatabase"
DB_HOST = "urHost"

JWT_SECRET = yourJWTSecret
```

create .env file in the **client** directory and add the following

```.env
EXPO_PUBLIC_SERVERIP = ""
```

start server and client

```bash
cd client
npm start
```

```bash
cd server
npm start
```
