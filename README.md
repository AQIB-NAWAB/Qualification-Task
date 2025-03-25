![Preview](assets/preview.png)

# Badge Assurance Qualification Task 

## Overview

This project is part of the Badge Assurance Qualification Task. It ensures a structured and reliable process for handling badge-related operations.

## Prerequisites

Ensure you have the following installed before proceeding:

- **Windows or Linux**
- **Git** ([https://git-scm.com/](https://git-scm.com/))
- **Node.js (LTS version)** ([https://nodejs.org/](https://nodejs.org/))
- **Docker (Optional but recommended for deployment)** ([https://www.docker.com/](https://www.docker.com/))

## Cloning the Repository

To get the project on your local machine, run:

```sh
# Clone the repository
git clone https://github.com/AQIB-NAWAB/Qualification-Task
cd Qualification-Task
```

## Installing Dependencies

Run the following command inside the project directory:

```sh
npm install
```

This will install all required dependencies for the project.

## Wrangler

To deploy , test and manage the cloudflare workers you need to install the wrangler. You can install the wrangler by running the following command:

```sh
npm install -g @cloudflare/wrangler
```

```sh
wrangler login
```

```sh
wrangler whoami
```


## Cloudflare Workers

To test the cloudflare workers locally you need to install the packages of the cloudflare workers.

```sh
cd workers
```
Currently there are two workers in the project. You can install the packages for both workers by running the following command:

```sh
cd assign-badge
npm install
```

```sh
cd get-assigned-users
npm install
```

## Configuration

Now you need to setup the configuration for the project. Run the following command:

```sh
cp .env.example .env
```

This will create a new `.env` file in the project root. Open the file and update the following values:

Please visit the [Configuration](Configuration.md) guide to set up the project.

## Scripts

The project comes with several scripts to help you with different tasks. You can run these scripts using `npm run <script-name>`.

Here are some of the scripts available:

- `setup-deploy`: Deploys the all cloudflare workers 
- `setup-secrets`: Sets up the necessary secrets for the cloudflare workers 
- `start`: Starts the server
- `dev`: Starts the server in development mode

## Running the Project

### On Windows (Powershell or CMD)

```sh
npm start
```

### On Linux/macOS

```sh
npm run start
```

If using Docker:

```sh
docker-compose up 
```

## Expected Output

Once the server is running, you should see an output similar to:

```
Server is running on http://localhost:3000
```

