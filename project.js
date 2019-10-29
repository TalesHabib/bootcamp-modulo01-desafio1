const express = require('express');

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

//Exibe o método, URL e tempo de resposta para cada requisição.
server.use((req, res, next)=> { 
  console.time('Request');
  console.log(`Método ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd('Request');
})

 //Middleware que checa se o projeto existe
 function checkProjectExists(req, res, next) {
  const { id } = req.params; 
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}


 //Middleware que dá log no número de requisições
 function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);


server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, name, email, occupation } = req.body;

  const project = {
    id,
    name,
    email,
    occupation,
    tasks: []
  };

  projects.push(project);

  return res.json(project); //Listagem de todos os projetos
});

server.put('/projects/:id', checkProjectExists, (req, res) => { 
  const { id } = req.params;
  const { name, email, occupation } = req.body; //Edita nome, email e profissão.
  


  const project = projects.find(p => p.id == id);

  project.name = name;
  project.email = email;
  project.occupation = occupation;



  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1); //Exclui o id selecionado. 

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(name);

  return res.json(project);
});

server.listen(5000);