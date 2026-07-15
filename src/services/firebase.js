/* eslint-disable import/no-extraneous-dependencies */
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const urlArchivesFirebase = 'luz-violeta-storage.appspot.com'; // Substitua pelo nome do seu bucket do Firebase Storage

const __filename = fileURLToPath(import.meta.url); // Nome do arquivo atual
const __dirname = path.dirname(__filename); // Diretório atual

// Caminho do certificado
const keyPath = process.env.FIREBASE_KEY_PATH || path.resolve(__dirname, '../config/firebase-key.json'); // Ajuste conforme necessário

// Inicializa apenas UMA vez
if (!admin.apps.length) {
	const firebaseKey = JSON.parse(fs.readFileSync(keyPath, 'utf8')); // Lê o arquivo de credenciais

	admin.initializeApp({
		credential: admin.credential.cert(firebaseKey), // Credenciais do Firebase
		storageBucket: urlArchivesFirebase, // Nome do bucket
	});
}

// Bucket correto
const bucket = admin.storage().bucket();

// Middleware de upload
const uploadImage = (req, res, next) => {
	if (!req.file) return next();

	const image = req.file; // Multer armazena o arquivo em req.file
	const extension = image.originalname.split('.').pop(); // Pega a extensão do arquivo
	const nameImageFirebase = `${crypto.randomUUID()}.${extension}`; // Nome único para o arquivo no Firebase
	const file = bucket.file(nameImageFirebase); // Cria uma referência ao arquivo no Firebase

	req.file.filename = nameImageFirebase;

	const stream = file.createWriteStream({
		metadata: {
			contentType: image.mimetype,
		},
	});

	stream.on('error', (err) => {
		console.error('Erro ao enviar imagem ao Firebase:', err);
		return res.status(500).json({ error: 'Erro ao enviar imagem' }); // Responde com erro
	});

	stream.on('finish', async () => {
		await file.makePublic();

		req.file.firebaseUrl = `https://storage.googleapis.com/${urlArchivesFirebase}/${nameImageFirebase}`; // URL pública da imagem

		return next();
	});

	stream.end(image.buffer); // Envia o buffer do arquivo para o Firebase Storage
};

export default uploadImage;



// Função para deletar um arquivo do bucket usando a "key" dele
export const deleteImageFirebase = async (filename) => {
	if (!filename) return;

	try {
		const file = bucket.file(filename);

		// Verifica se o arquivo realmente existe antes de tentar deletar
		const [exists] = await file.exists();
		if (exists) {
			await file.delete();
			console.log(`Imagem antiga deletada com sucesso do Firebase: ${filename}`);
		}
	} catch (err) {
		console.error('Erro ao deletar imagem do Firebase:', err);
		// Não travamos a requisição se a deleção falhar, para não quebrar a experiência do usuário
	}
};