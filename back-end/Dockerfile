FROM node:18-alpine

WORKDIR /project-back-end

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]