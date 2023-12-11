import {
    createBook,
    getBooks,
    getAllBooks,
    getBooksGenres,
    getBooksSearch,
    updateBookTimes,
    deleteBook,
  } from "../controllers/book.js";
  import express from "express";
  
  // Create an express router
  const router = express.Router();
  
  // Every path we define here will get /api/todos prefix
  // To make code even more cleaner we can wrap functions in `./controllers` folder
  
  // GET /api/books
  router.get("/", getBooks);
  // GET /api/books/all
  router.get("/all", getAllBooks);
  // GET /api/books/category
  router.get("/category", getBooksGenres);
  // GET /api/books
  router.get("/search", getBooksSearch);
  // POST /api/books
  router.post("/", createBook);
  // PUT /api/books/:id
  router.put("/", updateBookTimes);
  // DELETE /api/books/:id
  router.delete("/:id", deleteBook);
  
  // export the router
  export default router;
  