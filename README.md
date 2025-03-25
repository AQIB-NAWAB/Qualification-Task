# Badge Assurance Qualification Task - README

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

## Configuration

Now you need to setup the configuration for the project. Run the following command:

```sh
cp .env.example .env
```

This will create a new `.env` file in the project root. Open the file and update the following values:

## General

- `PORT`: The port on which the server will run. Default is `3000`.

## Google Sheets Configuration

Here are the detailed steps to get the required credentials:

1. Go to [Google Developers Console](https://console.cloud.google.com/).

Create a new project.

![alt text](image.png)

Give it a name and click on create.

![alt text](image-1.png)

Visit the library 
![alt text](image.png)

Search for Google Sheets API and enable it.

![alt text](image-3.png)

![alt text](image-4.png)

Now we need to create a service account.

Go to the credentials section.

Click on manage service accounts.
![alt text](image-5.png)

Click on create service account.
![alt text](image-6.png)

Give it a name and provide the editor role.
![alt text](image-7.png)
![alt text](image-8.png)

Now service account is created sucessfully. We need to generate a private key.
Click on actions and create key.
![alt text](image-9.png)

Click on add key
![alt text](image-10.png)

Select JSON and click on create.
![alt text](image-11.png)

It will download a JSON file. Open the file and copy the contents.

![alt text](image-12.png)


Now you need to replace the following values in the `.env` file:

- **GOOGLE_CLIENT_EMAIL**: The email address of the service account.
- **GOOGLE_PRIVATE_KEY**: The private key of the service account.

Now create a new google sheet and share it with the email address of the service account.

Visit this [link](https://docs.google.com/spreadsheets/u/0/)

Click on blank and create a new sheet.
![alt text](image-13.png)

Create a proper structure of the sheet. The first row should contain the column names.
![alt text](image-14.png)

Now share the sheet with the email address of the service account as editor.
![alt text](image-15.png)

Now you can access the sheet using the google sheet API.

## Badgr API Configuration
To get the required credentials for the Badgr API, follow these steps:

1. Go to [Badgr](https://badgr.com/).
2. Sign in to your account with email and password.
3. Go to the issuer section.
4. Click on the create issuer 
![alt text](image-16.png)
5. Provide necessary details and click on create.

Now you need to create the badge

1. Click on create badge.
![alt text](image-17.png)
2. Provide necessary details and click on create.

Now you need to grab the credentials.

1. Go to the issuer section.
2. Click on the issuer you created.
In url you will find the issuer id.
![alt text](image-18.png)
3. Click on the badge you created.
In url you will find the badge id.
![alt text](image-19.png)

Now you need to replace the following values in the `.env` file:

- **BADGR_EMAIL**: The email address of the Badgr account.
- **BADGR_PASSWORD**: The password of the Badgr account.
- **ISSUER_ID**: The issuer id of the badge.
- **BADGE_ID**: The badge id of the badge.

## Cloudflare Configuration

visit this [link](https://dash.cloudflare.com/)
Create an account and login.
Get your CLOUDFLARE_ID from the dashboard.


These all values can be found in the downloaded JSON file.


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
docker-compose up --build
```

## Expected Output

Once the server is running, you should see an output similar to:

```
Server is running on http://localhost:3000
Database connected successfully
```

You can visit `http://localhost:3000` to interact with the application.

## Building for Production

To create a production build, run:

```sh
npm run build
```

This will generate optimized production files.

## Troubleshooting

- If you encounter dependency issues, try running:
  ```sh
  npm audit fix --force
  ```
- If the server doesn’t start, ensure all required environment variables are set properly.

## Additional Notes

For Windows users, if facing permission issues, try running commands with **Administrator privileges**.

For any additional setup, refer to the documentation or reach out for support.

---

Happy Coding! 🚀

