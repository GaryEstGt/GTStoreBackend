var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const {MongoClient} = require('mongodb');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const port = 3000
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

app.post('/crear', async function (req, res) {
  producto.product_name=req.body.name
  producto.Cod_prod=req.body.cod
  producto.product_type=req.body.type
  producto.product_price=req.body.price
  producto.product_desc=req.body.desc
  const res_creado= await crearProducto(producto)
  if(res_creado!='no creado'){
    res.sendStatus(200)
  }else{
    res.sendStatus(404)
  }

});

app.put('/actualizar', async function (req, res) {
  producto.product_name=req.body.name
  producto.Cod_prod=req.body.cod
  producto.product_type=req.body.type
  producto.product_price=req.body.price
  producto.product_desc=req.body.desc
  const res_act=await actualizarProducto(producto.Cod_prod,producto)
  if(res_act.matchedCount!='0'){
    res.sendStatus(201)
  }else{
    res.sendStatus(404)
  }
});

app.get('/buscar', async function (req, res) {
    id=req.query.id || '';
    if(id!=''){
      const prod= await buscarProducto(id)
      if(prod!='sin resultados'){
        res.send(prod)
      }else{
        res.sendStatus(404)
      }
    }
});
app.delete('/eliminar', async function (req, res) {
  id=req.query.id || '';
  if(id!=''){
    const prod= await eliminarProducto(id)
    if(prod.deletedCount!='0'){
      res.sendStatus(20o)
    }else{
      res.sendStatus(404)
    }
  }
});

app.get('/mostrar', async function (req, res) {
    const prod= await mostrarTodos()
    res.send(prod.pretty)
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function crearProducto(Producto){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para crear registro en la base de datos
      var res= await  createListing(client,Producto);
  } catch (e) {
    //manejador de errores
      res= console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return res
  }
}
async function actualizarProducto(Cod,Producto){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para actualizar registro en la base de datos
      var res= await  updateListingByCod(client,Cod,Producto);
  } catch (e) {
    //manejador de errores
      res= console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return res
  }
}
async function eliminarProducto(Cod){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para actualizar registro en la base de datos
      var res= await  deleteListingByCod(client,Cod);
  } catch (e) {
    //manejador de errores
      res= console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return res
  }
}
async function buscarProducto(id){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para encontrar un registro en la base de datos
     var resultado= await  findOneListingById(client,id);
  } catch (e) {
    //manejador de errores
      resultado = console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return resultado
  }
}
async function mostrarTodos(){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para encontrar un registro en la base de datos
     var resultado= await findAll(client);
     while (resultado.hasNext()) {
      console.log(resultado.next());
   }
  } catch (e) {
    //manejador de errores
      resultado = console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
      return resultado
  }
}

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createListing(client, newListing){
  const result = await client.db("GT_Store_1").collection("Productos").insertOne(newListing);
  console.log(`New listing created with the following id: ${result.insertedId}`);
  if(result)
  {return result.insertedId}
  else
  {return 'no creado'}
}

async function findOneListingById(client, id) {
  const result = await client.db("GT_Store_1").collection("Productos").findOne({Cod_prod: id });
  if (result) {
      console.log(`Found a listing in the collection with the name '${id}':`);
      console.log(result);
      return result
  } else {
      console.log(`No listings found with the id '${id}'`);
      return 'sin resultados'
  }
}

async function findAll(client) {
  const result = await client.db("GT_Store_1").collection("Productos").find();
  if (result) {
     // console.log(`Found a listing in the collection with the name '${re}':`);
      return result
  } else {
      console.log('No listings found with the id');
      return 'sin resultados'
  }
}

async function updateListingByCod(client, Cod, updatedListing) {
  const result = await client.db("GT_Store_1").collection("Productos")
                      .updateOne({ Cod_prod: Cod }, { $set: updatedListing });
  console.log(`${result.matchedCount} document(s) matched the query criteria.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
  return result
}
async function deleteListingByCod(client, Cod) {
  const result = await client.db("GT_Store_1").collection("Productos")
          .deleteOne({ Cod_prod: Cod });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
  if (result) {
    return result
} else {
    return 'no eliminado'
}
}

app.listen(port, () => {
  console.log(`GT Store Backend listening at http://localhost:${port}`)
})
module.exports = app;
