var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const {MongoClient} = require('mongodb');
const { resolve } = require('url');
var ObjectId = require('mongodb').ObjectId; 
const port = 4200
var app = express();
var md5 =require("md5");
const llave='ContraseñaWebToken'
jwt = require('jsonwebtoken')
const axios = require('axios');
const redis = require('redis');

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Methods','*');
  next();
});

const client = redis.createClient(6379);
 
client.on("error", (error) => {
 console.error(error);
});

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.post('/crear', async function (req, res) {

  const res_creado= await crearProducto(producto = {
    Cod_prod:req.body.cod,
    product_foto:req.body.foto,
    product_name:req.body.name,
    product_type:req.body.type,
    product_price:req.body.price,
    product_desc:req.body.desc
   })
    res.sendStatus(200)
});

app.put('/actualizar', async function (req, res) {
  const res_act=await actualizarProducto(req.body.id,producto={
    Cod_prod:req.body.cod,
    product_foto:req.body.foto,
    product_name:req.body.name,
    product_type:req.body.type,
    product_price:req.body.price,
    product_desc:req.body.desc
  })
    res.sendStatus(201)
});

app.get('/buscar', async function (req, res) {
    id=req.query.id || '';
    if(id!=''){
      client.get(id, async (err, producto) => {
        if (producto) {
          console.log("tomando desde cache")
          return res.status(200).send(producto)
        } else { // When the data is not found in the cache then we can make request to the server
 
          const prod= await buscarProducto(id)
          // save the record in the cache for subsequent request
          client.setex(id, 1440, JSON.stringify(prod));
          // return the result to the client
          return res.send(prod).status(200)
      }
    }); 
    }else{
      res.sendStatus(404)
    }
});
app.delete('/eliminar', async function (req, res) {
  id=req.query.id || '';
  if(id!=''){
    const prod= await eliminarProducto(id)
    if(prod==1){
      res.sendStatus(200)
    }else{
      res.sendStatus(404)
    }
  }
  else{
    res.sendStatus(404)
  }
});

app.get('/mostrar', async function (req, res) {
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para encontrar un registro en la base de datos
      var resultado=await client.db("GT_Store_1")
      .collection("Productos")
      .find()
      .toArray(async function(err, result) {
        //console.log(result)
        await client.close(); //Se cierra la conexión
        return res.status(200).json(result)});
  } catch (e) {
    //manejador de errores
    console.error(e);
    await client.close();
    return res.status(404)
  } 
});

app.post('/mostraradm', async function (req, res) {
  const token = req.body.token
  var respuesta="";
  if (token) {
    jwt.verify(token, 'ContraseñaWebToken', async (err, payload) => {      
     if (err) {
        return res.status(401).send(err);
     } else {
      const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
      const client = new MongoClient(uri);
      try {
          await client.connect(); //se apertura la conexión
          // función para encontrar un registro en la base de datos
          var resultado=await client.db("GT_Store_1")
          .collection("Productos")
          .find()
          .toArray(async function(err, result) {
            //console.log(result)
            await client.close(); //Se cierra la conexión
            return res.status(200).json(result)});
      } catch (e) {
        //manejador de errores
        console.error(e);
        await client.close();
        return res.status(404)
      }  
     }
   });
 } else {
    return res.status(401).send("no se envió token"); 
   }
  }
);

app.post('/autenticar', async function (req, res) {
  user=req.body.usuario || '';
  password=req.body.contrasena || '';
  console.log(user)
  if(user!='' && password!=''){
    const usuario= await buscarUsuario(user)
    if(usuario!=null){
     if(user==usuario.usuario && md5(password)==usuario.contraseña) {
      const payload = {
        check:  true
       };
       const token = jwt.sign(payload, llave, {
        expiresIn: 1440
       });
       console.log(token)
      res.status(200).json({ mensaje: "Usuario correcto",token: token})
     }
     else{
      res.status(200).json({ mensaje: "Usuario o contraseña incorrectos"})
     }
    }else{
      res.status(200).json({ mensaje: "El usuario no existe"})
    }
  }else{
    res.status(404).json({ mensaje: "Usuario o contraseña incorrectos"})
  }
});


async function crearProducto(Producto){
  //string de conexión a base de datos
  if(producto){
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para crear registro en la base de datos

      var result = await client.db("GT_Store_1").collection("Productos").insertOne(Producto);
      console.log(`New listing created with the following id: ${result.insertedId}`);
  } catch (e) {
    //manejador de errores
      result= 'error' 
      console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return result
  }}else{
    return null
  }
}
async function actualizarProducto(id,Producto){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para actualizar registro en la base de datos
      var result = await client.db("GT_Store_1").collection("Productos")
                      .updateOne({ _id: ObjectId(id) }, { $set: Producto });
      console.log(`${result.matchedCount} document(s) matched the query criteria.`);
      console.log(`${result.modifiedCount} document(s) was/were updated.`);
  } catch (e) {
    //manejador de errores
      result=null
      console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return result
  }
}
async function eliminarProducto(id){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  let retorno=null
  try {
      await client.connect(); //se apertura la conexión
      // función para actualizar registro en la base de datos
      var result = await client.db("GT_Store_1").collection("Productos")
      .deleteOne({ _id: ObjectId(id) });
      console.log(`${result.deletedCount} document(s) was/were deleted.`);
      retorno=result.deletedCount
  } catch (e) {
    //manejador de errores
    retorno='error'
    console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return retorno
  }
}
async function buscarProducto(id){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para encontrar un registro en la base de datos
      var result = await client.db("GT_Store_1").collection("Productos").findOne({_id: ObjectId(id) });
      if (result) {
          console.log(`Found a listing in the collection with the name '${id}':`);
          console.log(result);
      } else {
          console.log(`No listings found with the id '${id}'`);
      }
  } catch (e) {
    //manejador de errores
    result='error'
    console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return result
  }
}

async function buscarUsuario(usuario){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para encontrar un registro en la base de datos
      var result = await client.db("GT_Store_1").collection("Usuarios").findOne({usuario:usuario });
      if (result) {
          console.log(`Found a listing in the collection with the name '${usuario}':`);
          console.log(result);
      } else {
          console.log(`No listings found with the id '${usuario}'`);
      }
  } catch (e) {
    //manejador de errores
    result='error'
    console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return result
  }
}

app.listen(port, () => {
  console.log(`GT Store Backend listening at http://localhost:${port}`)
})
module.exports = {
  app,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  buscarProducto
};
