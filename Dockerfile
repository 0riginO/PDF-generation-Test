FROM node:18-alpine

WORKDIR /app
RUN apk add --no-cache chromium python3 make g++
COPY . /app
RUN npm install
ENV SMTP_PASS="omxq egfu hmbl eacl"
ENV PORT=5000
EXPOSE 5000
CMD [ "npm", "run", "prod" ]