# Angular App with NestJS Backend API

This is an application with an Angular frontend communicating with a NestJS backend API. The backend utilizes SQLite as its database.

## Prerequisites

1. [Node.js](https://nodejs.org/) (v14 or above)
2. [Angular CLI](https://cli.angular.io/)
3. [NestJS CLI](https://nestjs.com/)
4. [Nodemon](https://nodemon.io/)

## Installation

Follow the steps below to set up the development environment:

1. **Frontend Setup**
    ```bash
    cd sport-events-app
    npm install
    ```

2. **Backend Setup**
    ```bash
    cd sport-events-api
    npm install
    ```

## Running the Application

1. **Start the Backend**
    ```bash
    cd sport-events-api
    nodemon watch
    ```

   🚨 **Note**: On the first launch, the backend may encounter an insecure connection error. Open [https://localhost:3000](https://localhost:3000) in your browser and accept the insecure connection. This step is only required once.

2. **Start the Frontend**
    ```bash
    cd sport-events-app
    ng serve
    ```

3. Once both applications are running, open your browser and navigate to [https://localhost:4200](https://localhost:4200).

## Database Information

The application uses an SQLite database named `db.sqlite`. It comes pre-populated with some existing data. This data is essential for specific application functionalities and should not be deleted without understanding the implications.

In case you want to interact directly with the database, you can use tools like [DB Browser for SQLite](https://sqlitebrowser.org/) or any SQLite-compatible client.

## Potential Issues and Troubleshooting

### Insecure Backend Connection

On the first launch, the backend might encounter a secure connection issue. This happens because the self-signed certificate used for the backend isn't recognized by your browser as a trusted certificate.

To fix this:

1. Open [https://localhost:3000](https://localhost:3000) in your browser.
2. You will receive a warning about the connection not being private. Proceed to the site (the exact instructions might vary depending on the browser).
3. Once you've accepted the insecure connection, the frontend will be able to communicate with the backend without issues.

## Feedback and Contributions

If you encounter any bugs or wish to add features, please open an issue or submit a pull request. Your feedback is greatly appreciated!

## License

This project is open source and available under the [MIT License](LICENSE).
