# PhotoGallery Application

This is a MERN stack application built using Microservices and Event Driven Architecture. The application is divided into several microservices, each responsible for a specific functionality.

## Microservices

1. **view_generator_serv**: This microservice is built with React and is responsible for the frontend of the application. It communicates with the backend services to fetch and display the photos, monitor usage, and manage user accounts.

2. **StorageMgmtServ**: This is a backend service built with Express and Node.js. It manages the storage of photos. It has its own MongoDB database. It receives requests from the frontend service to store and retrieve photos.

3. **UsageMntrServ**: This is a backend service built with Express and Node.js. It monitors the usage of the application. It has its own MongoDB database. It tracks the number of photos stored, the storage used, and other usage metrics.

4. **UserAccMgmtServ**: This is a backend service built with Express and Node.js. It manages user accounts. It has its own MongoDB database. It handles user registration, authentication, and account management.

5. **EventBus**: This is a backend service built with Express and Node.js. It is responsible for managing the communication between the other services using an event-driven architecture.

## Getting Started

To get the application running, follow these steps:

1. Clone the repository.

2. Each microservice requires a `.env` file for environment variables such as database connections, API keys, and other sensitive information. Make sure to create a `.env` file in each microservice's directory and add the necessary variables. Refer to the `.env.example` file in each directory for the required variables.

3. For each microservice, navigate to its directory, install the necessary dependencies, and start the service. Here is an example for the `view_generator_serv` microservice:

    ```bash
    cd view_generator_serv
    npm install
    npm start
    ```

Repeat these steps for each microservice: `StorageMgmtServ`, `UsageMntrServ`, `UserAccMgmtServ`, and `EventBus`.

## Contributors

- [Muhammad Ashhub Ali](https://github.com/NightWalker7558)
- [Wasif Mehmood](https://github.com/wasif2mehmood)
- [Adeel Ahmad Qureshi](https://github.com/itsAdee)
- [Muhammad Bilal](https://github.com/mbilal234)
- [Abdul Arham](https://github.com/a-arham-x)

## Branches

- The `development` branch runs on localhost. 

- To access the Google Cloud Platform (GCP) version of the application, switch to the `main` branch. [Switch to main](https://github.com/itsAdee/PhotoGallery/tree/main)

- To access the Docker Desktop version of the application, switch to the `Docker_Desktop` branch. [Switch to Docker_Desktop](https://github.com/itsAdee/PhotoGallery/tree/DockerDesktop)

## Contributions

We welcome contributions from everyone. If you're interested in contributing, here are some guidelines:

1. Fork the repository and create your own branch.

2. Make your changes and commit them to your branch.

3. Submit a pull request with your changes.

Please make sure to follow the existing code style and include tests for any new features or changes.

Before submitting a pull request, please make sure all tests pass and there are no linting errors.