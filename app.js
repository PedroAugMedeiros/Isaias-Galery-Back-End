const express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');
const path = require('path');
var jsonParser = bodyParser.json()
const multer = require('multer');

const app = express();
const uploadUser = require('./middlewares/uploadImage');
const fs = require('fs');


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    app.use('/files', express.static(path.resolve(__dirname,'images', 'upload', '')));
    next();
    app.use("/images", express.static(path.join(__dirname, "images")));
});

const readFile = (getImages) => {
  if(getImages) {
    console.log('OK')
    const content = fs.readFileSync('./public/upload/users', 'base64')
    return JSON.parse(content)
  } else {
    const content = fs.readFileSync('./users.json', 'utf-8')
    return JSON.parse(content)
  }
  }
  
  const writeFile = (content) => {
    const updateFile = JSON.stringify(content)
    fs.writeFileSync('./users.json', updateFile, 'utf-8')
  }
  
  // var dir = path.join(__dirname, 'public');

// var mime = {
//     html: 'text/html',
//     txt: 'text/plain',
//     css: 'text/css',
//     gif: 'image/gif',
//     jpg: 'image/jpeg',
//     png: 'image/png',
//     svg: 'image/svg+xml',
//     js: 'application/javascript'
//   };

//   app.get('*', function (req, res) {
//       var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
//       if (file.indexOf(dir + path.sep) !== 0) {
//           return res.status(403).end('Forbidden');
//       }
//       var type = mime[path.extname(file).slice(1)] || 'text/plain';
//       var s = fs.createReadStream(file);
//       s.on('open', function () {
//           res.set('Content-Type', type);
//           s.pipe(res);
//       });
//       s.on('error', function () {
//           res.set('Content-Type', 'text/plain');
//           res.status(404).end('Not found');
//       });
//   });
  
  
  app.get('/', (req, res) => {
    const content = readFile()
    res.send(content)
  })

  app.get("/files", async (req, res) => {

    // if (req.file) {
    //     //console.log(req.file);
    //     return res.json({
    //         erro: false,
    //         mensagem: "Upload realizado com sucesso!"
    //     });
    // }

    // return res.status(400).json({
    //     erro: true,
    //     mensagem: "Erro: Upload não realizado com sucesso, necessário enviar uma imagem PNG ou JPG!"
    // });
      const content = readFile(true)
    console.log(content)
      res.send(content)

});

// Define o middleware `multer`
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, "images"),
    filename: (req, file, cb) => {
      cb(null, file.originalname)  
  }
  }),
});

// Define a rota `POST` para receber o upload de uma imagem
app.post("/images", upload.single("image"), (req, res) => {
  // Obtém o nome da imagem
  console.log('dsde')
  const imageName = req.file.filename;

  // Retorna a imagem
  res.sendFile(path.join(__dirname, "uploads", imageName));
});
  
  app.get('/getUsers', (req, res) => {
    const content = readFile()
  
    res.send(content)
  })

  app.get('/getImages', (req, res) => {

    const fotosDir = "./images";
    
    const images = fs.readdirSync(fotosDir);
    console.log(images)
    
    res.send(images);

  })

  app.get("/getImage/:filename", (req, res) => {
const imagesPath = path.join(__dirname, "images");
// Obtenha o nome do arquivo da imagem
const filename = req.params.filename;
  
// Carregue a imagem do arquivo
const image = fs.readFileSync(path.join(imagesPath, filename));
  
// Envie a imagem para o cliente
res.setHeader("Content-Type", "image/jpg");
res.send(image);
  });
  
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

app.post("/upload-image", uploadUser.single('image'), async (req, res) => {

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



app.listen(9000, () => {
    console.log("Servidor iniciado: https://isaias-galery-back-end.onrender.com");
});