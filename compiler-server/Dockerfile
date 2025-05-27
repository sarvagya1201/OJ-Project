# 1. Base image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy files
COPY package*.json ./
COPY . .

# 4. Install dependencies
RUN npm install

# 5. Install compilers
RUN apt-get update && \
    apt-get install -y g++ default-jdk python3 python3-pip && \
    apt-get clean

# 6. Create necessary folders (in case they're not committed)
RUN mkdir -p /app/code_files /app/executables

# 7. Expose port
EXPOSE 5001

# 8. Start the server
CMD ["node", "server.js"]
