FROM node:20.13-buster

# Definir el directorio de trabajo
WORKDIR /backend3kutzner

# Copiar los archivos de configuración de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instalar las dependencias y compilar bcrypt desde el origen
RUN npm install --build-from-source

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que correrá la aplicación
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]
