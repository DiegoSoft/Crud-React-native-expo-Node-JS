const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const UserModel = require('./models/users');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcrypt');



app.use(cors())
app.get('/', (req, res) => {
  res.send('<h2>Servidor Iniciado!</h2>');
});


// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './projecto.db'

});



// Middleware para parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Instanciando os Modelos 
const users = UserModel(sequelize, DataTypes)



app.get('/users', async (req, res) => {
  const user = await users.findAll();
  res.json(user);
});

app.get('/users/:id', async (req, res) => {
  const user = await users.findByPk(req.params.id);
  res.json(user);

});

app.post('/users/create', async (req, res) => {
  const {name, senha, status, perfil} = req.body;
  const saltRounds = 1; // Puedes ajustar el número de rondas de sal
  const hashedPassword = await bcrypt.hash(senha, saltRounds);

  await users.create({ name, senha:hashedPassword, status, perfil });
  //const User = await users.create({ nome, senha:hashedPassword, status, perfil });
  res.json(name);

});

app.put('/users/update/:id', async (req, res) => {
  const user = await users.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);

  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});


app.put('/senha/update/:id', async (req, res) => {
  
  const {senha} = req.body;
  const saltRounds = 1;
  const novoPassword = await bcrypt.hash(senha, saltRounds);

  const user = await users.findByPk(req.params.id);

 if (user) {
    user.senha = novoPassword;
    await user.save();
    res.json(novoPassword);

  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});


app.delete('/users/:id', async (req, res) => {
  const user = await users.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: 'Usuário excluído' });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }


});





// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
