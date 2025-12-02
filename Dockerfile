FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=8080
EXPOSE 8080

# Prevent Railway from running "npm start"
CMD ["node", "server.js"]
