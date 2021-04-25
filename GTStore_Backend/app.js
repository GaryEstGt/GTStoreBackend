var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const {MongoClient} = require('mongodb');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { resolve } = require('url');
var ObjectId = require('mongodb').ObjectId; 
const port = 4200
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let producto = {
  Cod_prod:'',
  product_name:'',
  product_type: '',
  product_price:0.0,
  product_desc:''
 };
 let productoAct = {
  Cod_prod:'',
  product_name:'',
  product_type: '',
  product_price:0.0,
  product_desc:''
 };

app.post('/crear', async function (req, res) {
  producto.product_name=req.body.name
  producto.Cod_prod=req.body.cod
  producto.product_type=req.body.type
  producto.product_price=req.body.price
  producto.product_desc=req.body.desc
  const res_creado= await crearProducto(producto)
  if(res_creado!='error'){
    res.sendStatus(200)
  }else{
    res.sendStatus(404)
  }

});

app.put('/actualizar', async function (req, res) {
  productoAct.product_name=req.body.name
  var id=req.body.id
  productoAct.Cod_prod=req.body.cod
  productoAct.product_type=req.body.type
  productoAct.product_price=req.body.price
  productoAct.product_desc=req.body.desc
  const res_act=await actualizarProducto(id,productoAct)
  if(res_act.matchedCount!=0){
    res.sendStatus(201)
  }else{
    res.sendStatus(404)
  } 
});

app.get('/buscar', async function (req, res) {
    id=req.query.id || '';
    if(id!=''){
      const prod= await buscarProducto(id)
        res.send(prod).status(200)
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

async function crearProducto(Producto){
  //string de conexión a base de datos
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
