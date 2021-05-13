FROM node:15

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 7000 
CMD [ "npm", "start" ]

# to build image from this this Dockerfile run this commant from current directory
# sudo docker build -t sobirjon/full_stack_interview_app:0.1 .