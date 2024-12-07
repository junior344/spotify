FROM node:16-alpine

WORKDIR /app

# Copier les fichiers nécessaires et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Ajouter le dossier des binaires locaux au PATH
RUN PATH=$PATH:/app/node_modules/.bin

# Copier le reste des fichiers et construire l'application
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
