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

5. Presionar Execute, si el registro fue exitoso se muestra el usuario creado, sino aparecera
   un mensaje diciendo que el email o usuario ya existen

\*POST /usuarios/login

1.Damos click en en este endpoint
2.Damos click en try it out

3.  Aparecera un JSON como el que se muestra a continuacion:

                {
                "username": "string",
                "email": "string",
                "password": "string"
                }

4.  reemplazamos los campos con los datos del usuario creado

                {
                "username": "josegomez",
                "email": "josegomez@gmail.com",
                "password": "1234"
                }

5.  Si el logueo es exitoso obtendremos un token, este debera ser usado para todas las peticiones.
    Hay que tener en cuenta que este token es solo valido por 50 minutos. si se supera este tiempo,
    hay que generar otro.

\*POST /pedidos

1.  damos click a este endpoint
2.  pegamos el token en el campo user-token
3.  Nos aparecera un area de texto con un JSON como el siguiente:

            {
                "pagoId": 0,
                "stageId": 0,
                "usuarioId": 0,
                "chosenProductos": [
                    "string"
                    ]
            }

4.  podemos llenar los campos con los siguientes datos de prueba. en usuarioId no se debe poner nada
    porque el pedido toma el id del usuario logueado, tener en cuenta que pagoId debe ser un valor entre
    1 y 3 de otra forma se generara un error que dice que ese id no existe, el stageId debe estar entre 1
    y 5, de lo contrario genera error. En el momento solo hay creados tres productos si se pone un Id con otros ids simplemente estos no se agregan.

                {
                    "pagoId": 1,
                    "stageId": 2,
                    "usuarioId": 0,
                    "chosenProductos": [
                        "1","2","3"
                        ]
                }

5.  Al final si el producto se crea se obtendra un log como el que se muestra a continuacion.

                {
                    "Result": "producto con id 1 insertado: producto con id 2 insertado: producto con id 3 insertado: "
                }

\*POST /pedidos/{pedidoId}/stage

1.  Vamos a este endpoint
2.  Click en try it out
3.  pegamos el token
4.  ponemos el Id del pedido, en nuestro ejemplo el id 4
5.  Aparecera un JSON como el siguiente:

                {
                    "stageId": 0
                }

6.  Reemplazamos el valor por un StageId distinto entre 1 y 5, sino aparecera error.

                {
                    "stageId": 2
                }

7.  si la respuesta es exitosa nos mostrara el pedido

8.  si vamos a la base de datos y modificamos el rolId del usuario por 2 e intentamos
    otra vez este endpoint, veremos que no estamos autorizados

\*POST /pedidos/{pedidoId}/stage
