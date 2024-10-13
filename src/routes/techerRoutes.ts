import { Router } from 'express';
import { getAllBooks, addBook, deleteBook, updateBook } from '../controllers/bookController';

const router = Router();

router.get('/books', getAllBooks);
router.post('/books', addBook);
router.delete('/books/:id', deleteBook);
router.put('/books/:id', updateBook);

export default router;