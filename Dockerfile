# Use an official Node.js runtime as a parent image.
FROM node:18

# Set the working directory.
WORKDIR /app

# Copy package files and install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build TypeScript.
RUN npm run build

# Start the application.
CMD ["node", "dist/index.js"]
