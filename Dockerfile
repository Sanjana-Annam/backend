# ---- Backend Dockerfile ----
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies first (better build caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy rest of the backend files
COPY . .

# Environment
ENV PORT=8080
EXPOSE 8080

# Start backend
CMD ["node", "server.js"]
