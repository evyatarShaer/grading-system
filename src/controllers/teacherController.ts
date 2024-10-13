import { Request, Response } from 'express';
import User from "../models/userModel";
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await User.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const addBook = async (req: Request, res: Response) => {
  const { title, author, year } = req.body;
  const newBook = new User({ title, author, year });

  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
};


export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author, year } = req.body;

  try {
    const updatedBook = await User.findByIdAndUpdate(
      id,
      { title, author, year },
      { new: true }
    );

    if (!updatedBook) {
      res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' }); // הוספת return כאן
  }
};
