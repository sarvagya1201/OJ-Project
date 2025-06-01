# # 1. Base image
# FROM node:18

# # 2. Set working directory
# WORKDIR /app

# # 3. Copy files
# COPY package*.json ./
# COPY . .

# # 4. Install dependencies
# RUN npm install

# # 5. Install compilers
# RUN apt-get update && \
#     apt-get install -y g++ default-jdk python3 python3-pip && \
#     apt-get clean

# # 6. Create necessary folders (in case they're not committed)
# RUN mkdir -p /app/code_files /app/executables

# # 7. Expose port
# EXPOSE 5001

# # 8. Start the server
# CMD ["node", "server.js"]

## ALPINE VERSION (SMALL)
# 1. Base image: Node 18 Alpine
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first (for better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Install compilers and tools (g++, JDK, python3, pip)
RUN apk add --no-cache \
    g++ \
    openjdk11 \
    python3 \
    py3-pip

# 6. Create necessary folders
RUN mkdir -p /app/code_files /app/executables

# 7. Copy the rest of the application files
COPY . .

# 8. Expose port
EXPOSE 5001

# 9. Start the server
CMD ["node", "server.js"]
