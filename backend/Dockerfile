# Use official Node.js lightweight image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose port (Cloud Run sets PORT env dynamically, but exposing is good practice)
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
