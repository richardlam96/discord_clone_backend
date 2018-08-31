# Get the official Node 8 runtime.
FROM node:8.11.4

# Working directory.
WORKDIR /usr/src/app

# Copy package and package-lock to working directory.
COPY package*.json ./

RUN npm install

# Bundle app source.
COPY . .

# Make a port available outside the container.
EXPOSE 3000

# Run the app.
CMD ["node", "index.js"]
