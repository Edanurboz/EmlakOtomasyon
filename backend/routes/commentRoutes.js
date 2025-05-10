import express from 'express';
import { createComment, getCommentsByResidency, deleteComment } from '../controllers/commentController.js';
import jwtCheck from '../config/auth0Config.js';

const router = express.Router();

// Yorum ekleme
router.post('/', jwtCheck, createComment);

// Bir ev için tüm yorumları getirme
router.get('/residency/:residencyId', getCommentsByResidency);

// Yorum silme
router.delete('/:commentId', jwtCheck, deleteComment);

export default router; 