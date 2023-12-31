# PhotoGallery Application

This is a MERN stack application built using Microservices and Event Driven Architecture. The application is divided into several microservices, each responsible for a specific functionality.

## Microservices

1. **view_generator_serv**: This microservice is built with React and is responsible for the frontend of the application. It communicates with the backend services to fetch and display the photos, monitor usage, and manage user accounts.

2. **StorageMgmtServ**: This is a backend service built with Express and Node.js. It manages the storage of photos. It has its own MongoDB database. It receives requests from the frontend service to store and retrieve photos.

3. **UsageMntrServ**: This is a backend service built with Express and Node.js. It monitors the usage of the application. It has its own MongoDB database. It tracks the number of photos stored, the storage used, and other usage metrics.

4. **UserAccMgmtServ**: This is a backend service built with Express and Node.js. It manages user accounts. It has its own MongoDB database. It handles user registration, authentication, and account management.

5. **EventBus**: This is a backend service built with Express and Node.js. It is responsible for managing the communication between the other services using an event-driven architecture.

## Getting Started

To get the application running on Google Cloud Platform (GCP), follow these steps:

1. Clone the repository.

2. Each microservice requires a `.env` file for environment variables such as database connections, API keys, and other sensitive information. Make sure to create a `.env` file in each microservice's directory and add the necessary variables. Refer to the `.env.example` file in each directory for the required variables.

3. For each microservice, navigate to its directory, install the necessary dependencies. Here is an example for the `view_generator_serv` microservice:

    ```bash
    cd view_generator_serv
    npm install
    ```
    Repeat these steps for each microservice: `StorageMgmtServ`, `UsageMntrServ`, `UserAccMgmtServ`, and `EventBus`.

4. Create a cluster in Kubernetes Engine in GCP:
    
    ```bash
    gcloud container clusters create <CLUSTERNAME> --zone us-central1-a
    ``` 

5. Authenticate Docker to your Google Cloud account:

    ```bash
    gcloud auth configure-docker
    ```

6. Create a new cluster in the Kubernetes Engine:

    ```bash
    gcloud container clusters create <CLUSTERNAME> --zone us-central1-a
    ```

7. Get the credentials for your new cluster:

    ```bash
    gcloud container clusters get-credentials <CLUSTERNAME> --zone us-central1-a
    ```

8. Apply the Kubernetes Ingress NGINX controller:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.4/deploy/static/provider/cloud/deploy.yaml
    ```
9. Edit the `skaffold.yaml` file and all files in the `infra/k8s/` directory to replace `<PROJECT_ID>` and `<CLUSTERNAME>` with your Google Cloud Project ID and the name of your Kubernetes cluster, respectively.

10. Start the application:

    ```bash
    skaffold dev
    ```

## Contributors

- [Muhammad Ashhub Ali](https://github.com/NightWalker7558)
- [Wasif Mehmood](https://github.com/wasif2mehmood)
- [Adeel Ahmad Qureshi](https://github.com/itsAdee)
- [Muhammad Bilal](https://github.com/mbilal234)
- [Abdul Arham](https://github.com/a-arham-x)

## Branches

- You are currently on the `main` branch. This branch contains the version of the application that runs on Google Cloud Platform (GCP).

- The `development` branch contains the version of the application that runs on localhost. [Switch to development](https://github.com/itsAdee/PhotoGallery/tree/development)

- To access the Docker Desktop version of the application, switch to the `Docker_Desktop` branch. [Switch to Docker_Desktop](https://github.com/itsAdee/PhotoGallery/tree/DockerDesktop)