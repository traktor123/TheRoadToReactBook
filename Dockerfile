# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Install a lightweight web server to serve the static files
RUN npm install -g serve

# Set the environment variable to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5000

# Command to serve the built app using serve
CMD ["serve", "-s", "dist", "-l", "5000"]