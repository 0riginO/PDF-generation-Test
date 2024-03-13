FROM node:alpine

COPY . /app
WORKDIR /app
RUN apk add chromium
RUN npm install
ENV SMTP_PASS="omxq egfu hmbl eacl"
ENV PORT=5000
EXPOSE 5000
CMD [ "npm", "run", "prod" ]