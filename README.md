# Proyecto ChrisRoutesDyn: Aplicación Web con Angular, NodeJS, PostgreSQL y API Externa

## Descripción
Esta aplicación web es un proyecto sencillo pero completo que incluye un frontend, backend, una base de datos relacional y la integración con un servicio externo a través de su API.

## Funcionalidades
- Frontend SPA con diseño responsivo y funcionalidades dinámicas.
- API REST desarrollada con Node.js y Express para manejar la lógica del servidor.
- Persistencia de datos en PostgreSQL.
- Conexión e interacción con un servicio externo mediante su API.

## Autor
Christofher Cardenas
chriscard11@gmail.com

---

## Tecnologías Utilizadas

### **Frontend**
- **Framework:** Angular (versión 19, Standalone).
- **Descripción:** Angular es un framework para desarrollo de aplicaciones web dinámicas de una sola página (SPA). La versión standalone elimina la dependencia de módulos, simplificando la estructura y mejorando la eficiencia en el desarrollo.

### **Backend**
- **Lenguaje y Framework:** Node.js con Express y Axios.
- **Descripción:** Node.js es una plataforma de JavaScript que permite construir aplicaciones rápidas y escalables. Express proporciona una estructura ligera y modular para crear APIs REST. Axios es utilizado para realizar solicitudes HTTP, lo cual facilita la integración con APIs externas.

### **Base de Datos**
- **Base de Datos Relacional:** PostgreSQL.
- **Descripción:** PostgreSQL es un sistema de gestión de bases de datos relacional de código abierto, conocido por su estabilidad, rendimiento y soporte para consultas complejas.


## Instalación y Configuración
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/usuario/repo.git
   cd repo
   ```

2. **Configuración del Frontend**
   - Navegar al directorio del frontend.
   ```bash
   cd frontend
   ```
   - Instalar las dependencias.
   ```bash
   npm install
   ```
   - Ejecutar la aplicación.
   ```bash
   ng serve
   ```

3. **Configuración del Backend**
   - Navegar al directorio del backend.
   ```bash
   cd api
   ```
   - Instalar las dependencias.
   ```bash
   npm install
   ```
   - Configurar las variables de entorno en el archivo db-api.js.
   ```
   const pool = new Pool({
      user: 'chriscard11',
      host: 'localhost',
      database: 'dbdynchris',
      password: '@dm1n',
      port: 5432,
    });
   ```
   
4. **Configuración de la Base de Datos**
   - Basta con autenticar correctamente la base de datos PostgreSQL.
   - El backend crea las tablas automaticamente en caso que no existan.

# Ejecución
   Basta con ejecutar npm start en el directorio base.
   ```bash
   npm start
   ```
   Ya que se integró en el package.json los comandos para ejecutar el api y emular el servicio externo
   ```bash
   "start": "concurrently \"npx json-server public/assets/db.json\" \"node api/db-api.js\" \"ng serve\"",
   ```

