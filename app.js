
import  Express  from "express";
import Morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import Opinion from './models/opinion.js'
import fetch from 'node-fetch'
import cors from 'cors'


/*
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API de comentarios",
        version: "1.0.0",
        description:
          "Esta es una API para poder encontrar informacion de los comentarios",
      },
      servers: [
        {
          url: "http://localhost:3200",
        },
      ],
    },
    apis: [""],
  };
*/



const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({extended:true})); 
app.use(Morgan('dev'))
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method', 'x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
})
//app.use(RutasUsuario)
app.set('puerto', process.env.PORT || 3200)



//GET con  
app.get("/", async(req,response)=>{
  await fetch("https://api-comercios.herokuapp.com/puntuacion")
  .then((resp) => {
      return resp.json()
  }).then((res) => {
      console.log(JSON.stringify(res))
      let menor = res.menor;
      let mayor = res.mayor;
      let promedio = res.promedio;
      console.log(menor)
      console.log(mayor)
      console.log(promedio)
      if ((menor < mayor) && (promedio <= mayor) && (promedio >= menor) && (3<=mayor)) {
          new Opinion({
              comentario: "Los productos son buenos, recomiendo el comercio",
              valoracion: mayor
          }).save()
          

      } else {

          if ((menor < mayor) && (promedio >= mayor)) {
              new Opinion({
                  comentario: "Los productos del comercio son buenos",
                  valoracion: promedio
              }).save()
              
          }
          else {
              if ((menor <= mayor) && (promedio === menor)&& (mayor<3)) {
                  new Opinion({
                      comentario: "Malisimo, mal servicio no lo recomiendo para nada",
                      valoracion: menor
                  }).save()
                  


              }
          }
      }
  })

  const opinion = await Opinion.find().sort({ $natural:-1 }).limit(3)
  response.send(opinion);
}) 

export default app
