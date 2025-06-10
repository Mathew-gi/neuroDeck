FROM node:24-alpine
WORKDIR /NeuroDeck
COPY package*.json ./
RUN npm install
COPY . .
RUN if [ ! -f ".env"]; then echo "no .env!"; fi
EXPOSE 3000
CMD ["npm","run","dev"]