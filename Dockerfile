# Use Alpine-based Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the NestJS app
RUN npm run build

# Make wait-for-it.sh available
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Expose port
EXPOSE 8080

# Run the app, waiting for DB to be ready
CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "run", "start:prod"]
