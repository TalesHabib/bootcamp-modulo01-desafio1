const express = require('express');

const server = express();

server.use(express.json());

// Query Params = ?teste=1
// Route Params = /users/1
// Request body = { "name": "Tales", "email": "tales.habib@gmail.com"  }

const users = ['Tales', 'Diego', 'Claudio'];

server.use((req, res, next)=> { 
  console.time('Request');
  console.log(`Método ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd('Request');
})

function checkUserExists (req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Nome de usuário não requerido' })
  }
  return next();
}
function checkUserInArray (req, res, next) {
  const user = users[req.params.index]
  if (!user) {
    return res.status(400).json({ error: 'Nome de usuário não existe' })
  }
  req.user = user; 

  return next();
}

server.get('/users/', (req, res)=> {
  return res.json(users); //Listagem de todos os usuarios
})

server.get('/users/:index', checkUserInArray, checkUserInArray, (req, res)=>{

  return res.json(req.user); //Listagem de um usuario (users[index]) const {index} =req.params
})

server.post('/users', checkUserExists, (req, res)=> {
  const { name } = req.body;

  users.push(name); //cria um novo usuario.
  
  return res.json(users);

});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res)=> {
 const { index } = req.params;
 const { name } = req.body;
 
 users[index] = name; //atualizar/altera um usuário

return res.json(users);

});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  
  users.splice(index, 1); //deleta um usuário.
 
  return res.json(users); //ou pode usar um res.send() so pra informar que está tudo certo (nao aparece na tela)


})


server.listen(3000); //nodemon yarn nodemon nomedojs.js ou adicionar em package.json