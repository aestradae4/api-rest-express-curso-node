const express = require('express');
const Joi = require('@hapi/joi');
const ruta = express.Router();

// Manejo solicitudes get
const usuarios = [
    {id:1, nombre:'Grover'},
    {id:2, nombre:'Pablo'},
    {id:3, nombre:'Ana'}
];

// Ruta dentro del get
// Esto se llama gestionar rutas '/api/usuarios'
ruta.get('/', (req, res)=>{ 
    res.send(usuarios);
});

// Para buscar usuarios por el parametro id: http://localhost:5000/api/usuarios/10
// Manejo solicitudes get
ruta.get('/:id', (req, res)=>{ 
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
ruta.get('/:year/:mes', (req, res)=>{ 
    // res.send(req.params);
    res.send(req.query);
});

// Manejo de solicitudes post
ruta.post('/', (req, res) =>{
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

ruta.delete('/:id', (req, res) =>{ 
    let usuario = existeUsuario(req.params.id);
    if(!usuario){ 
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios);
});

ruta.put('/:id', (req, res) =>{ 
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

function existeUsuario(id){ 
    return(usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){ 
    const schema =  Joi.object({ 
        nombre: Joi.string().min(3).required()
    });
    return(schema.validate({ nombre: nom }));
}

module.exports = ruta;