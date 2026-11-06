import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    authorExists,
} from '../models/books.js';

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body;

        if (!id || !authorId || !title || !publicationDate) {
            return res.status(400).json({ message: 'Missing required book fields.' });
        }

        const existing = await getBookById(id);
        if (existing) {
            return res.status(400).json({ message: 'Book id already exists.' });
        }

        if (!(await authorExists(authorId))) {
            return res.status(400).json({ message: 'authorId does not match an existing author.' });
        }

        const created = await createBook({ id, authorId, title, publicationDate });
        return res.status(201).json(created);
    } catch (error) {
        console.error('POST /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBookHandler = async (req, res) => {
    try {
        const { authorId, title, publicationDate } = req.body;

        if (!authorId || !title || !publicationDate) {
            return res.status(400).json({ message: 'Missing required book fields.' });
        }

        const existing = await getBookById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!(await authorExists(authorId))) {
            return res.status(400).json({ message: 'authorId does not match an existing author.' });
        }

        const updated = await updateBook(req.params.id, {
            authorId,
            title,
            publicationDate,
        });
        return res.status(200).json(updated);
    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteBookHandler = async (req, res) => {
    try {
        const existing = await getBookById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: 'Book not found' });
        }
        await deleteBook(req.params.id);
        return res.status(204).send();
    } catch (error) {
        console.error('DELETE /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export {
    getBooksHandler,
    getBookByIdHandler,
    createBookHandler,
    updateBookHandler,
    deleteBookHandler,
};