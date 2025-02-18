# Backend Assignment - REST API

Within this assignment the REST API for an e-commerce website is implemented according to the Entity-Relationship Diagram outlining the data model including the relationships and attributes of collections within the system.

## Contents

- [Team](#team)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [ER Diagram](#er-diagram)
- [Project Features](#project-features)
- [Project Structure](#project-structure)
- [Testing](#testing)

## Team

- Shtanko Yaroslav
- Md Shayemur Rahman
- Amjad Shakhshir
- Alexey Sytnikov

## Technologies

![Typescript](https://img.shields.io/badge/Typescript-4.9.5-blue)
![NodeJS](https://img.shields.io/badge/NodeJS-20.10.0-purple)
![ExpressJS](https://img.shields.io/badge/ExpressJS-4.18.2-red)
![Mongoose](https://img.shields.io/badge/Momgoose-8.0.0-yellow)

## Getting started

- Clone the project `git clone https://github.com/sytnikov/fs16-backend-public.git`;
- Create your `.env` file using `.env.example` file as an exaple and fill it with your credentials;
- Use `npm install` to install all dependencies and necessary packages;
- Run the server using `npm run sever`.

## ER Diagram

Within the project, the following entities are covered: users, products, categories, orders, roles, payments, and shipments.
![er-diagram](Database-ER-diagram.png)

### Project Features

### Entity CRUD Operations

Based on the specifications provided in the ERD assignment the basic CRUD (Create, Read, Update, Delete) operations for the entities are implemented.

### Authentication and authorization

For security resons, certain endpoint are protected with the following middleware:

- checkAuth: verifying is a user is logged in. There are two ways of authentication implemented: using JWT and brokered authentication with Google;
- checkRole: verifying if a user is a customer or and admin;
- checkPermissions: verifying if an admin has a particular access

### Response Format

All API responses are provided in JSON format which includes a `status`, `data`, and an optional `message` field.

### Error Handling

To handle API errors, the apiErrorHandler is implemented.

## Project Structure

Below is the high-level project folder structure represented.

```
 .
 ├── server
 |  ├── controllers
 |  ├── middlewares
 |  ├── models
 |  ├── routes
 |  ├── schemas
 |  ├── services
 |  ├── test
 |  ├── types
 |  ├── utils
 |  ├── app.ts
 |  ├── server.ts
 ├── .env.example
 ├── .gitignore
 ├── package.json
 ├── Database-ER-diagram.png
 ├── README.md
 ├── jest.config.ts
 └── tsconfig.json
```

## Testing

The test cases for all the key Services and Controllers have been built with Jest testing library. In this porject, unit testing and integration testing approaches were used. The test requests are sent to the built mock server, not the real API.

Run `npm run test` to implement all the tests.
