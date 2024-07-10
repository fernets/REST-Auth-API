# REST Auth API

Backend app for authentication using Node.js, Express, TypeScript, MongoDB, Typegoose and Zod.

## Table of Contents

- [REST Auth API](#rest-auth-api)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Development](#development)
  - [Build](#build)
  - [Start](#start)
  - [Environment Variables](#environment-variables)
  - [Docker](#docker)
  - [Makefile](#makefile)
  - [Swagger Documentation](#swagger-documentation)
  - [Endpoints](#endpoints)
    - [Auth](#auth)
    - [HealthCheck](#healthcheck)
    - [User](#user)
  - [Postman Collection](#postman-collection)
  - [Libraries](#libraries)
    - [Dependencies](#dependencies)
    - [DevDependencies](#devdependencies)
  - [Links](#links)

## Requirements

- Node.js 20.x or higher
- npm or yarn
- Docker (optional)

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/fernets/REST-Auth-API.git
   cd rest-auth-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy the `.env.example` file to `.env` and fill in the required values:

   ```sh
   cp .env.example .env
   ```

## Development

To start the development server, run:

```sh
npm run serve
```

This will start the server in development mode with hot reloading.

## Build

To build the project, run:

```sh
npm run build
```

This will compile the TypeScript code to JavaScript and output it in the `dist` directory.

## Start

To start the production server, run:

```sh
npm run start
```

This will start the server in production mode.

## Environment Variables

- `NODE_ENV`: Environment mode (`development`, `production`, etc.)
- `MONGODB_URI`: MongoDB connection URI
- `ACCESS_TOKEN_PUBLIC_KEY`: Public key for verifying access tokens (Base64 encoded)
- `ACCESS_TOKEN_PRIVATE_KEY`: Private key for signing access tokens (Base64 encoded)
- `REFRESH_TOKEN_PUBLIC_KEY`: Public key for verifying refresh tokens (Base64 encoded)
- `REFRESH_TOKEN_PRIVATE_KEY`: Private key for signing refresh tokens (Base64 encoded)
- `SMTP_USER`: SMTP user for email service
- `SMTP_PASS`: SMTP password for email service
- `SMTP_HOST`: SMTP host for email service
- `SMTP_PORT`: SMTP port for email service
- `SMTP_SECURE`: SMTP secure flag for email service (true/false)

Ensure you generate new keys before deploying your application. Follow the links to generate and encode keys:

- Generate keys: [Generate Keys](https://travistidwell.com/jsencrypt/demo/)
- Base64 encode the keys: [Base64 Encode](https://www.base64encode.org/)

## Docker

To build and run the application using Docker:

1. Build the Docker image:

   ```sh
   docker build -t backend-prod .
   ```

2. Start the Docker container:

   ```sh
   docker run -d -p 80:80 --rm --name backend-prod backend-prod
   ```

3. Stop the Docker container:

   ```sh
   docker stop backend-prod
   ```

## Makefile

You can use the provided Makefile for common tasks:

- Build the Docker image:

  ```sh
  make build
  ```

- Start the Docker container:

  ```sh
  make start
  ```

- Stop the Docker container:

  ```sh
  make stop
  ```

## Swagger Documentation

The project uses Swagger for API documentation. To access the Swagger documentation, start the server and navigate to the following URL in your browser:

```sh
http://localhost:80/docs
```

Swagger will provide an interactive interface to explore and test the API endpoints.

## Endpoints

### Auth

- **POST /api/v1/auth/login**

  - Logs in to user account

- **POST /api/v1/auth/refresh**

  - Refreshes access token

- **POST /api/v1/auth/logout**
  - Logs out from user account

### HealthCheck

- **GET /api/v1/healthcheck**
  - Responds if server is up and running

### User

- **POST /api/v1/users/register**

  - Registers a new user

- **POST /api/v1/users/verify/:userID/:verificationCode**

  - Verify user account

- **POST /api/v1/users/forgotpassword**

  - Send email with password reset link

- **POST /api/v1/users/resetpassword/:userID/:passwordResetCode**

  - Reset user password

- **GET /api/v1/users/me**
  - Get current authenticated user data

## Postman Collection

The project includes a Postman collection to facilitate testing the API. You can import the `REST Auth API.postman_collection.json` file into Postman and use it to test the different endpoints of the application.

1. Open Postman.
2. Click on `File` -> `Import` in the top left corner.
3. Select the `REST Auth API.postman_collection.json` file from the project directory to add the collection to your Postman workspace.

You can now use the imported collection to test the API endpoints.

## Libraries

### Dependencies

- `@typegoose/typegoose`: ^12.5.0 - For type-safe MongoDB models
- `argon2`: ^0.40.3
- `config`: ^3.3.12
- `cors`: ^2.8.5
- `dayjs`: ^1.11.11
- `dotenv`: ^16.4.5
- `express`: ^4.19.2
- `helmet`: ^7.1.0 - For security headers
- `jsonwebtoken`: ^9.0.2
- `lodash`: ^4.17.21
- `mongoose`: ^8.4.5
- `nodemailer`: ^6.9.14
- `pino`: ^9.2.0
- `zod`: ^3.23.8

### DevDependencies

- `@types/config`: ^3.3.4
- `@types/cors`: ^2.8.17
- `@types/express`: ^4.17.21
- `@types/jsonwebtoken`: ^9.0.6
- `@types/lodash`: ^4.17.6
- `@types/node`: ^20.14.9
- `@types/nodemailer`: ^6.4.15
- `@types/swagger-jsdoc`: ^6.0.4
- `@types/swagger-ui-express`: ^4.1.6
- `cross-env`: ^7.0.3
- `eslint`: ^9.6.0 - For linting
- `eslint-config-prettier`: ^9.1.0
- `eslint-plugin-prettier`: ^5.1.3
- `globals`: ^15.8.0
- `pino-pretty`: ^11.2.1
- `prettier`: ^3.3.2 - For code formatting
- `swagger-jsdoc`: ^6.2.8
- `swagger-ui-express`: ^5.0.1
- `ts-node-dev`: ^2.0.0
- `typescript`: ^5.5.3
- `typescript-eslint`: ^7.15.0

## Links

- [Generate Keys](https://travistidwell.com/jsencrypt/demo/)
- [Base64 Encode](https://www.base64encode.org/)
- [Swagger Docs in your application](http://localhost:80/docs)

This project serves as a foundation for building authentication systems in your applications. You can use it as a base to develop more complex and feature-rich systems by modifying and extending its functionalities. Feel free to integrate additional features, enhance security measures, or adapt it to suit your specific requirements. With its modular design and use of modern technologies, it offers a flexible and scalable starting point for your authentication needs.
