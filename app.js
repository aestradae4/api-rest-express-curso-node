const debug = require('debug')('app:inicio'); 
// const dbDebug = require('debug')('app:db');
const express = require('express');
const Joi = require('@hapi/joi');
// const logger = require('./logger');
const morgan = require('morgan');
const config = require('config');
const app = express();


// Manejo de peticiones post 
app.use(express.json());
// Apis middleware
app.use(express.urlencoded({extended:true}));
// link http://localhost:3000/prueba.txt
app.use(express.static('public'));

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

// Manejo solicitudes get
const usuarios = [
    {id:1, nombre:'Grover'},
    {id:2, nombre:'Pablo'},
    {id:3, nombre:'Ana'}
];

// Ruta dentro del get
app.get('/', (req, res)=>{
    res.send('Hola mundo desde Express');
});

// Ruta dentro del get
// Esto se llama gestionar rutas '/api/usuarios'
app.get('/api/usuarios', (req, res)=>{ 
    res.send(usuarios);
});

// Para buscar usuarios por el parametro id: http://localhost:5000/api/usuarios/10
// Manejo solicitudes get
app.get('/api/usuarios/:id', (req, res)=>{ 
    // let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id)
    if(!usuario){ 
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    res.send(usuario);
    // res.send(req.params.id);
}); 

// res.send(req.params) http://localhost:5000/api/usuarios/1999/10 
// res.send(req.query); http://localhost:5000/api/usuarios/1999/10?sexo=M
app.get('/api/usuarios/:year/:mes', (req, res)=>{ 
    // res.send(req.params);
    res.send(req.query);
});

// Manejo de solicitudes post
app.post('/api/usuarios', (req, res) =>{
     // Validacion de datos con el mudulo joi
    // const schema =  Joi.object({ 
    //     nombre: Joi.string().min(3).required()
    // });
    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){ 
        const usuario = { 
            // Para saber el tama;o de usuarios y vaya sumando + 1
            id: usuarios.length + 1, 
            nombre: value.nombre
        };
        // Para que lo agrege a la tabla usuarios 
        usuarios.push(usuario);
        res.send(usuario);
    }else{ 
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});

app.put('/api/usuarios/:id', (req, res) =>{ 
    // Encontrar si existe el objeto usuario
    // let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id);
    if(!usuario){ 
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    // const schema =  Joi.object({ 
    //     nombre: Joi.string().min(3).required()
    // });
    const {error, value} = validarUsuario(req.body.nombre);
    if(error){ 
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
    usuario.nombre = value.nombre;
    res.send(usuario);
}); 

// Actualizar puerto
const port = process.env.PORT || 3000;
app.listen(port, ()=>{ 
    console.log(`Escuchando en el puerto ${port}...`);
});  

app.delete('/api/usuarios/:id', (req, res) =>{ 
    let usuario = existeUsuario(req.params.id);
    if(!usuario){ 
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios);
});

function existeUsuario(id){ 
    return(usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){ 
    const schema =  Joi.object({ 
        nombre: Joi.string().min(3).required()
    });
    return(schema.validate({ nombre: nom }));
}
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