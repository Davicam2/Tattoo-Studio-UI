FROM node:12.11.1

RUN mkdir -p /app

WORKDIR /app

COPY package*json /app/

RUN npm install

COPY . /app/

EXPOSE 4200

# ENV CHOKIDAR_USEPOLLING=true

#CMD ["npm", "prod" ]
CMD ["npm", "run", "prod"]
