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
  product_name:'',
  product_type: '',
  product_price:0.0,
  product_desc:''
 };

let producto_encontrado;

app.post('/crear', function (req, res) {
  producto.product_name=req.body.name
  producto.product_type=req.body.type
  producto.product_price=req.body.price
  producto.product_desc=req.body.desc
  crearProducto(producto)
  res.send("enviado")
});

app.get('/buscar', function (req, res) {
    id=req.query.id || 0;
    if(id!=''){
      buscarProducto(id)
      res.send(producto_encontrado)
    }
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

/*async function main(){

   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details

  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  listDatabases(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}*/
async function crearProducto(Producto){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para crear registro en la base de datos
      await  createListing(client,Producto);
  } catch (e) {
    //manejador de errores
      console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
  }
}
async function buscarProducto(id){
  //string de conexión a base de datos
  const uri = "mongodb+srv://garydev:adminGTStore@cluster0.xmmh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
      await client.connect(); //se apertura la conexión
      // función para encontrar un registro en la base de datos
      await  findOneListingById(client,id);
  } catch (e) {
    //manejador de errores
      console.error(e);
  } finally {
      await client.close(); //Se cierra la conexión
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
}

async function findOneListingById(client, id) {
  const result = await client.db("GT_Store_1").collection("Productos").findOne({ _id: id });
  if (result) {
      console.log(`Found a listing in the collection with the name '${id}':`);
      console.log(result);
      producto_encontrado=result
  } else {
      console.log(`No listings found with the name '${id}'`);
  }
}
app.listen(port, () => {
  console.log(`Laboratorio 1 listening at http://localhost:${port}`)
})
module.exports = app;
