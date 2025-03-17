# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies

RUN yarn install --frozen-lockfile

# Copy rest of the app
COPY . .

# Build the React app
RUN yarn build

# Serve the app using a lightweight server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port
EXPOSE 3000
