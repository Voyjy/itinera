FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create assets directory (will be mounted via volume)
RUN mkdir -p /app/assets

# Expose port
EXPOSE 4007

# Start the service
CMD ["node", "index.js"]
