# Use an official Node.js runtime as a parent image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and bun.lockb files to the working directory
COPY package.json bun.lockb ./

# Install the dependencies
RUN bun install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the application
CMD ["bun", "run", "src/index.ts"]