const debug = require('debug')('app:inicio'); 
// const dbDebug = require('debug')('app:db');
const usuarios = require('./routes/usuarios')
const express = require('express');
// const logger = require('./logger');
const morgan = require('morgan');
const config = require('config');
const app = express();


// Manejo de peticiones post 
// Middleware
app.use(express.json());//body
// Apis middleware
app.use(express.urlencoded({extended:true}));
// link http://localhost:3000/prueba.txt
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);
// configuracion de entornos 
console.log('Aplicacion' + config.get('nombre'));
console.log('DB Server' + config.get('configDB.host'));

// Usando middleware de terceros 
if(app.get('env') === 'development'){ 
    app.use(morgan('tiny'));
    // console.log('Morgan habilitado');
    debug('Morgan habilitado...');
}

// debug base de datos 
    debug('Conectanto con la base de datos');


// Middleware 
// app.use(logger);
// app.use(function (req, res, next){
//     console.log('Autenticando');
//     next();
// })


// Ruta dentro del get
app.get('/', (req, res)=>{
    res.send('Hola mundo desde Express');
})

// Actualizar puerto
const port = process.env.PORT || 3000;
app.listen(port, ()=>{ 
    console.log(`Escuchando en el puerto ${port}...`);
});  

// Forma de hacer el post pero con un if
// Validacion de datos para que no ingrese un valor vacio y para que ingrese un nombre mayor a 3 letras
    // if(!req.body.nombre || req.body.nombre.length <= 2){
        // 400 Bad Request 
        // res.status(400).send('Debe ingresar un nombre que tenga por lo menos 3 letras');
        // return;
    // }
    // const usuario = { 
    //     // Para saber el tama;o de usuarios y vaya sumando + 1
    //     id: usuarios.length + 1, 
    //     nombre: req.body.nombre 
    // };
    // // Para que lo agrege a la tabla usuarios 
    // usuarios.push(usuario);
    // res.send(usuario);