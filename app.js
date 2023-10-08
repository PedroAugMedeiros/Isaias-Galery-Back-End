const express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
const uploadUser = require('./middlewares/uploadImage');
const fs = require('fs');
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();
});

const readFile = () => {
    const content = fs.readFileSync('./users.json', 'utf-8')
    return JSON.parse(content)
  }
  
  const writeFile = (content) => {
    const updateFile = JSON.stringify(content)
    fs.writeFileSync('./users.json', updateFile, 'utf-8')
  }
  
  
  app.get('/', (req, res) => {
    const content = readFile()
    res.send(content)
  })
  
  app.get('/getUsers', (req, res) => {
    const content = readFile()
  
    res.send(content)
  })
  
  app.get('/getHistory/:id', (req, res) => {
    const content = readFile()
    const { id } = req.params;
    const getSelected = content.find((item) => item.id === id)
    const atualizations = getSelected.historyAtualization;
    res.send(atualizations)
  })
  
  app.get('/getUser/:email', (req, res) => {
    const content = readFile()
    const { email } = req.params
    const userSelected = content.find((user) => user.email === email)
  
  return res.send(userSelected)
  })
  app.post('/register', jsonParser, function (req, res) {
    const { name, email, password, clothings, favoriteClothings, token } = req.body
    const currentContent = readFile()
  
    currentContent.push({ name,  email, password, clothings, favoriteClothings, token })
    writeFile(currentContent)
    res.send({ name,  email, password, clothings, favoriteClothings, token })
  })
  
  app.post("/uploadImage", uploadUser.single('image'), async (req, res) => {
  
    if (req.file) {
        console.log(req.file);
        return res.json({
            erro: false,
            mensagem: "Upload realizado com sucesso!"
        });
    }
  
    return res.status(400).json({
        erro: true,
        mensagem: "Erro: Upload não realizado com sucesso, necessário enviar uma imagem PNG ou JPG!"
    });
  
  
  
  });
  
  app.put('/edit/:id', (req, res) => {
    const currentContent = readFile()
    const { id } = req.params;
  
    const { title, body, dateAtualization, dateCreation, edited } = req.body;
  
    const getPrevious = currentContent.find((item) => item.id === id)
  
    const previous = {
      edited: getPrevious.edited,
      id: getPrevious.id,
      title: getPrevious.title,
      body: getPrevious.body,
      dateCreation: getPrevious.dateCreation,
      dateAtualization: dateAtualization,
    }
  
    currentContent.forEach(item => {
      if (item.id === id) {
        item.edited === edited;
        item.title = title;
        item.body = body;
        item.dateAtualization = dateAtualization;
        item.dateCreation = dateCreation;
        item.historyAtualization.push(previous)
      }
    });
  
    const history = getPrevious.historyAtualization;
  
    history.map((item, index) => item.id = index)
    writeFile(currentContent)
    res.send(currentContent)
  })
  
  app.delete('/delete/:id', (req, res) => {
    const { id } = req.params
    const currentContent = readFile()
    const newDb = currentContent.filter((item) => item.id !== id)
    writeFile(newDb)
    res.send(currentContent)
  })

app.post("/upload-image", uploadUser.single('image'), async (req, res) => {

    if (req.file) {
        //console.log(req.file);
        return res.json({
            erro: false,
            mensagem: "Upload realizado com sucesso!"
        });
    }

    return res.status(400).json({
        erro: true,
        mensagem: "Erro: Upload não realizado com sucesso, necessário enviar uma imagem PNG ou JPG!"
    });



});

app.listen(9000, () => {
    console.log("Servidor iniciado na porta 9000: http://localhost:9000");
});