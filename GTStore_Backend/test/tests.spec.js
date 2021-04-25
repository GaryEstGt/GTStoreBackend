var assert    = require("chai").assert;
var chai = require("chai");
var app = require ("../app")
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const url= 'http://localhost:4200';

describe("Creación de un nuevo registro en la base de datos: ", function() {
    it("Verifica el valor retornado al crear un producto: ", function(done) {
        let producto = {
            Cod_prod:'COD0020',
            product_name:'Laptop 2020',
            product_type: 'Laptop',
            product_price: '2020.00',
            product_desc:'Laptop de prueba jejes'
           };
        result   = app.crearProducto(producto);
        done();
        assert.typeOf(result, "Object");
        });
});
describe("Actualización de un registro en la base de datos: ", function() {
    it("Verifica el valor retornado al actualizar un producto: ", function(done) {
        let producto = {
            Cod_prod:'COD0090',
            product_name:'Laptop 2020',
            product_type: 'Laptop',
            product_price: '2020.00',
            product_desc:'Laptop de prueba jejes'
           };
           var id="6051704f353f6a08e8877442"
        result   = app.actualizarProducto(id,producto);
        done();
        assert.typeOf(result, "Object");
        });
});
describe("Eliminar un registro en la base de datos: ", function() {
    var id;
    it("Crea el producto a eliminar: ", function(done) {
        let producto = {
            Cod_prod:'creado para eliminar',
            product_name:'Laptop 2020',
            product_type: 'Laptop',
            product_price: '2020.00',
            product_desc:'Laptop de prueba jejes'
           };
        resulta   = app.crearProducto(producto);
        done();
        id=resulta.insertedId
        assert.typeOf(resulta, "Object");
        });
    it("Verifica el valor retornado al eliminar un producto: ", function(done) {
        result   = app.eliminarProducto(id);
        done();
        assert.equal(result, 1);
        });
});
describe("Buscar un registro en la base de datos: ", function() {
    it("Verifica el valor retornado al Buscar un producto: ", function(done) {
        id="6051704f353f6a08e8877442"
        result   = app.buscarProducto(id);
        done();
        assert.typeOf(result, "Object");
        });
});
describe('Crear un producto: ',()=>{
    it('should insert a product', (done) => {
        chai.request(url)
        .post('/crear')
        .send({name:"Laptop de prueba", cod: "COD100", type: "Laptop", price: "10", desc:"descripcion jeje"})
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(200);
        done();
        });
    });
    it('should fail when insert a product', (done) => {
        chai.request(url)
        .post('/crear')
        .send({})
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(404);
        done();
        });
    });
});
describe('Actualizar un producto: ',()=>{
    it('should update a product', (done) => {
        chai.request(url)
        .put('/actualizar')
        .send({name:"Laptop de prueba", cod: "COD100", type: "Laptop", price: "10", desc:"descripcion jeje", id:"6051704f353f6a08e8877442"})
        .end( function(err,res){    
        console.log(res.body)
        expect(res).to.have.status(201);
        done(); 
        });
    });
    it('should not found when update a product', (done) => {
        chai.request(url)
        .put('/actualizar')
        .send({name:"Laptop de prueba", cod: "COD100", type: "Laptop", price: "10", desc:"descripcion jeje", id:"6051704f353f6a08e8872020"})
        .end( function(err,res){    
        console.log(res.body)
        expect(res).to.have.status(404);
        done(); 
        });
    });
});
describe('Buscar un producto: ',()=>{
    it('should find a product', (done) => {
        chai.request(url)
        .get('/buscar?id=6051704f353f6a08e8877442')
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(200);
        done();
        });
    });
    it('should not find a product', (done) => {
        chai.request(url)
        .get('/buscar?id=')
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(404);
        done();
        });
    });
});
describe('Eliminar un producto: ',()=>{
    it('should delete a product', (done) => {
        chai.request(url)
        .delete('/eliminar?id=608487bc000b874c5c0b1d56')
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(200);
        done();
        });
    });
    it('should not found a product to delete', (done) => {
        chai.request(url)
        .delete('/eliminar?id=608487bc000b874c5c0b1d00')
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(404);
        done();
        });
    });
    it('should fail to delete a product', (done) => {
        chai.request(url)
        .delete('/eliminar?id=')
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(404);
        done();
        });
    });
});
   describe('Mostrar todos los productos: ',()=>{
    it('should show all products', (done) => {
    chai.request(url)
    .get('/mostrar')
    .end( function(err,res){
    //console.log(res.body)
    expect(res).to.have.status(200);
    done();
    });
    });
   });