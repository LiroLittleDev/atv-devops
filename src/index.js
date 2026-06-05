const express = require('express');
const multer = require('multer');
const minioClient = require('./minioClient');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const BUCKET = process.env.MINIO_BUCKET;

async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET, 'us-east-1');
  }
}

ensureBucket().catch(console.error);

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Envie um arquivo no campo file' });

    const { originalname, buffer, mimetype, size } = req.file;

    await minioClient.putObject(BUCKET, originalname, buffer, size, {
      'Content-Type': mimetype,
    });

    res.json({ message: 'Upload realizado com sucesso', filename: originalname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/files', async (req, res) => {
  try {
    const files = [];
    const stream = minioClient.listObjects(BUCKET, '', true);

    stream.on('data', (obj) => files.push(obj));
    stream.on('end', () => res.json(files));
    stream.on('error', (error) => res.status(500).json({ error: error.message }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});