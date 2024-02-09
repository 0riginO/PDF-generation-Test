FROM node:alpine

COPY . /app
WORKDIR /app
RUN apk add chromium
RUN npm install
ENV SMTP_PASS="hepn pevr pgif bgeh"
CMD [ "npm", "run", "prod" ]
