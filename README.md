                                        PROYECTO DELILAH RESTO-DAVID MERCADO

Para correr el proyecto se deben seguir los siguientes pasos:

1. Abrir un nuevo query en mysql y ejecutar:

CREATE DATABASE IF NOT EXISTS delilah

2. Abrir el archivo db.js y cambiar la palabra root por el usuario de tu servidor de base de datos y la palabra new_password por tu password.

3. Luego de esto ir a la terminal y ubicarse en la carpeta DelilahResto

4. Ejecutar el siguiente script node seed.js, al hacer esto se van a insertar datos de prueba para pedidos, usuarios, productos, pagos y stages. Si se quiere verificar esto se puede revisar las tablas en mysql.

5.Ejecutar el script npm start.

6. Abrir en el navegador la url http://localhost:3000/api-docs.

A continuacion se dan indicaciones para probar los endpoints:

                                    USUARIOS

\*POST /usuarios/register

1.  Si se quiere crear un nuevo usuario damos click en este endpoint
2.  damos click en try it out
3.  se nos abre un are de texto con el siguiente JSON

                {
                "username": "string",
                "firstName": "string",
                "lastName": "string",
                "email": "string",
                "phoneNumber": "string",
                "deliveryAddress": "string",
                "password": "string",
                "rolId": "string"
                }

4.llenamos username con datos de prueba ejemplo

                {
                "username": "josegomez",
                "firstName": "jose",
                "lastName": "gomez",
                "email": "josegomez@gmail.com",
                "phoneNumber": "5555",
                "deliveryAddress": "cr 2 no 18-74",
                "password": "1234",
                "rolId": "1"
                }

5. Presionar Execute, si l registro fue exitoso se muestra el usuario creado, sino aparecera
   un mensaje diciendo que el email o usuario ya existen

\*POST /usuarios/login

1.Damos click
