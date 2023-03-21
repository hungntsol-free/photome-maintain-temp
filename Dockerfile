FROM node:lts-alpine
# Create app dir
WORKDIR /usr/src/app
COPY package*.json ./
# Install dependencies
RUN npm install --production --silent && mv node_modules ../
COPY . .
# Use port
EXPOSE 3000
# Run
CMD [ "node", "app.js" ]