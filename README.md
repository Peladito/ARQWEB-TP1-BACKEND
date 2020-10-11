# Backend Yo estuve ahi

## Requisitos previos
- mongoDB: Instalacion de base de datos [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) 
- NodeJs: Instalacion de ennntorno de ejecución [NodeJs](https://nodejs.org/es/)
- SMTP: Contar con un smtp. Puede usarse un Faker como [EtherealMail](https://ethereal.email/)
## Configuracion
- Crear un archivo `.env` utilizando como template `.env.example`
- Configurar con los datos correspondientes a la base de datos mongo (si la instalacion de mongo es la default entonces no hay que cambiar nada)
- Configurar datos de smtp: en el caso de sar EtherealMail, crearse una cuenta y poner los datos de configuracion provistos para la cuenta creada
## Instalacion de dependencias
`npm i` en la carpeta raiz del proyecto (es decir donde se encuentre el package.json)
## Desplegar el servidor
`npm start`

## A tener en cuenta
- Cada 30 segundos se ejecuta un proceso para enviar las posibles notificaciones pendientes
- Las imagenes de los locales solo vienen con el URN, para la ruta completa hay que poner URL + /images/ + URN (ejemplo: http://localhost:3000/images/nombreImagen.png)
## Utilitarios

Para visualizar la base de datos MongoDB se puede utilizar o [NoSQLBooster](https://nosqlbooster.com/) o bien [Robo3T](https://robomongo.org/)
Para ver los mails enviados, entrar el la seccion de Mails de EtherealMail