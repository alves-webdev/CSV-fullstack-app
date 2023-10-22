import express from 'express';
import fileController from '../controllers/fileController';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), fileController.uploadFile);

export default router;
