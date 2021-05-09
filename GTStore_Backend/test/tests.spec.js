var assert    = require("chai").assert;
var chai = require("chai");
var app = require ("../app")
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const url= 'http://localhost:4200';
const eliminar1='6095af1d7c1a86068096bc49'
const eliminar2='6095afb06dacc4917ff6c624'
const prod='60959c55a6927e4994fe25c3'

describe("Creación de un nuevo registro en la base de datos: ", function() {
    it("Verifica el valor retornado al crear un producto: ", function(done) {
        let producto = {
            Cod_prod:'COD0020',
            product_name:'Laptop 2020',
            product_type: 'Laptop',
            product_price: '2020.00',
            product_desc:'Laptop de prueba jejes',
            product_foto:'https://drive.google.com/uc?id=1CI4wMRuop07XQdC7H78gbvvDd9_XePli'
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
            product_desc:'Laptop de prueba jejes',
            product_foto:'https://drive.google.com/uc?id=1CI4wMRuop07XQdC7H78gbvvDd9_XePli'
           };
        result   = app.actualizarProducto(prod,producto);
        done();
        assert.typeOf(result, "Object");
        });
});
describe("Eliminar un registro en la base de datos: ", async function() {
        it("Verifica el valor retornado al eliminar un producto: ", function(done) {
        result   = app.eliminarProducto(eliminar1);
        done();
        assert.equal(result, 1);
        });
});
describe("Buscar un registro en la base de datos: ", function() {
    it("Verifica el valor retornado al Buscar un producto: ", function(done) {
        result   = app.buscarProducto(prod);
        done();
        assert.typeOf(result, "Object");
        });
});
describe('Crear un producto: ',()=>{
    it('should insert a product', (done) => {
        chai.request(url)
        .post('/crear')
        .send({product_name:"Laptop de prueba", Cod_prod: "COD100", product_type: "Laptop", product_price: "10", product_desc:"descripcion jeje", product_foto:'https://drive.google.com/uc?id=1CI4wMRuop07XQdC7H78gbvvDd9_XePli'})
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(200);
        });
        done();
    });
});
describe('Actualizar un producto: ',()=>{
    it('should update a product', (done) => {
        let producto = {
            Cod_prod:'creado para eliminar',
            product_name:'Laptop 2020',
            product_type: 'Laptop',
            product_price: '2020.00',
            product_desc:'Laptop de prueba jejes',
            product_foto:'https://drive.google.com/uc?id=1CI4wMRuop07XQdC7H78gbvvDd9_XePli',
            id:prod
           };
        chai.request(url)
        .put('/actualizar')
        .send(producto)
        .end( function(err,res){    
        console.log(res.body)
        expect(res).to.have.status(201);
        done(); 
        });
    });
    it('should not found when update a product', (done) => {
        chai.request(url)
        .put('/actualizar')
        .send({name:"Laptop de prueba", cod: "COD100", type: "Laptop", price: "10", desc:"descripcion jeje", id:"60959c55a6927e4994fe250000"})
        .end( function(err,res){    
        console.log(res.body)
        expect(res).to.have.status(201);
        });
        done(); 
    });
});
describe('Buscar un producto: ',()=>{
    it('should find a product', (done) => {
        chai.request(url)
        .get('/buscar?id='+prod)
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(200);
        });
        done();
    });
    it('should not find a product', (done) => {
        chai.request(url)
        .get('/buscar?id=')
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(404);
        });
        done();
    });
});
describe('Eliminar un producto: ', ()=>{
     it('should delete a product',  (done) => {
         chai.request(url)
        .delete('/eliminar?id='+eliminar2)
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(200);
        });
        done();
    });
     it('should not found a product to delete',  (done) => {
         chai.request(url)
        .delete('/eliminar?id=608487bc000b874c5c0b1d00')
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(404);
        });
        done();
    });
     it('should fail to delete a product',  (done) => {
        chai.request(url)
        .delete('/eliminar?id=')
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(404);
        });
        done();
    });
});
   describe('Mostrar todos los productos: ', ()=>{
 it('should show all products', async (done) => {
     chai.request(url)
    .get('/mostrar')
    .end( function(err,res){
    //console.log(res.body)
    expect(res).to.have.status(200);
    });
    done();
    });
   });
   describe('Mostrar todos los productos con token: ', ()=>{
       var token
         it('should sign in a user', async (done)=> {
             chai.request(url)
            .post('/autenticar')
            .send({usuario:"Gmoran_admin", contrasena:"AdminGTStore2021"})
            .end( function(err,res){
            //console.log(res.body)
            expect(res).to.have.status(200);
        });
        done();
    });
   });