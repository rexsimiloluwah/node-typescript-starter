# build stage - build the artifacts for the final stage
FROM node:18-alpine as build-stage 
WORKDIR /app 
COPY . . 
RUN yarn install\
    && npm run build

# final stage 
FROM node:alpine as final-stage
WORKDIR /app  
COPY --from=build-stage ./app/dist ./dist
COPY package*.json ./
RUN yarn install --production --ignore-engines\
    && npm cache clean --force 
COPY docker.env ./

EXPOSE 5040 

# run the server 
CMD ["node", "dist/server.js"]
