import admin from 'firebase-admin';
import serviceAccount from "../config/fireBaseKey.json" assert { type: "json" };
import { ref as storageRef, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';


const BUCKET = "gs://isaias-galery.appspot.com"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET
});

const storage = admin.storage();

const bucket = admin.storage().bucket();

const uploadImage = (req, res, next) => {
    if(!req.file) return next();
    const imagem = req.file;
    const imageName = imagem.originalname;

    const file = bucket.file(imageName);

    const stream = file.createWriteStream({
        metadata: {
            contentType: imagem.mimetype,
        }
    })

    stream.on('error', (e) => {
        console.error(e);
    })

    stream.on("finish", async () => {
       await file.makePublic()
       const imageLink = `https://storage.googleapis.com/${BUCKET}/${imageName}`
       req.file.firebaseUrl = imageLink
    })
    stream.end(imagem.buffer)
}

// const getImages = async () => {
//     let list = [];

//     const imagesFolder = storageRef(storage, 'Isaias-Galery');
//     const photoList = await listAll(imagesFolder);

//     for(let i in photoList.items) {
//         let photoUrl = await getDownloadURL(photoList.items[i]);

//         list.push({
//             name: photoList.items[i].name,
//             url: photoUrl
//         });
//     }

//     return list;
// }


export {
    uploadImage,
}
