# Start from Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:latest

# Set work directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Run script
CMD ["npm", "start"]