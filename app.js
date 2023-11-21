import express from 'express';
import pkg from 'body-parser';
const { json } = pkg;
import cors from 'cors';
import { resolve, join } from 'path';
var jsonParser = json()
import multer, { memoryStorage } from 'multer';
import { uploadImage } from './services/firebase.js';
const app = express();
import { readFileSync, writeFileSync } from 'fs';
const Multer = multer({
  storage: memoryStorage()
})


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    // app.use('/files', express.static(resolve(__,'images', 'upload', '')));
    next();
    // app.use("/images", express.static(join(__, "images")));
});

const readFile = (getImages) => {
  if(getImages) {
    const content = readFileSync('./public/upload/users', 'base64')
    return JSON.parse(content)
  } else {
    const content = readFileSync('./users.json', 'utf-8')
    return JSON.parse(content)
  }
  }
  
  const writeFile = (content) => {
    const updateFile = JSON.stringify(content)
    writeFileSync('./users.json', updateFile, 'utf-8')
  }
  
  app.get('/', (req, res) => {
    const content = readFile()
    res.send(content)
  })
  
  app.get('/getUsers', (req, res) => {
    const content = readFile()
  
    res.send(content)
  })

  app.get("/getImage/:filename", (req, res) => {
const imagesPath = join(__dirname, "images");
// Obtenha o nome do arquivo da imagem
const filename = req.params.filename;
  
// Carregue a imagem do arquivo
const image = readFileSync(join(imagesPath, filename));
  
// Envie a imagem para o cliente
res.setHeader("Content-Type", "image/jpg");
res.send(image);
  });
  
  app.get('/getHistory/:id', (req, res) => {
    const content = readFile()
    const { id } = req.params;
    const getSelected = content.find((post) => post.id === id)
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
  
  // app.post("/uploadImage", uploadUser.single('image'), async (req, res) => {
  
  //   if (req.file) {
  //       console.log(req.file);
  //       return res.json({
  //           erro: false,
  //           mensagem: "Upload realizado com sucesso!"
  //       });
  //   }
  
  //   return res.status(400).json({
  //       erro: true,
  //       mensagem: "Erro: Upload não realizado com sucesso, necessário enviar uma imagem PNG ou JPG!"
  //   });
  
  
  
  // });
  
  app.put('/edit/:id', (req, res) => {
    const currentContent = readFile()
    const { id } = req.params;
  
    const { title, body, dateAtualization, dateCreation, edited } = req.body;
  
    // const getPrevious = currentContent.find((post) => post.id === id)
  
    // const previous = {
    //   edited: getPrevious.edited,
    //   id: getPrevious.id,
    //   title: getPrevious.title,
    //   body: getPrevious.body,
    //   dateCreation: getPrevious.dateCreation,
    //   dateAtualization: dateAtualization,
    // }
  
    currentContent.forEach(post => {
      if (post.id === id) {
        post.title = title
        post.date
      }
    });
  
    // const history = getPrevious.historyAtualization;
  
    // history.map((post, index) => post.id = index)
    writeFile(currentContent)
    res.send(currentContent)
  })
  
  app.delete('/delete/:id', (req, res) => {
    const { id } = req.params
    const currentContent = readFile()
    const newDb = currentContent.filter((post) => post.id !== id)
    writeFile(newDb)
    res.send(currentContent)
  })

app.get("/list-image", async (req, res) => {
  await Image.findAll()
  .then((images) => {
      return res.json({
          erro: false,
          images,
          url: "http://localhost:9000/files/users/"
      });
  }).catch(() => {
      return res.status(400).json({
          erro: true,
          mensagem: "Erro: Nenhuma imagem encontrada!"
      });
  });
});

app.post("/upload-image", Multer.single('image'), uploadImage, async (req, res) => {

    if (req.file) {
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
    console.log("Servidor iniciado: https://isaias-galery-back-end.onrender.com");
});