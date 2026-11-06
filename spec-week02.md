# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the Week 01 book API so book documents include a reference to an author and the API supports full CRUD for books. Every book route is documented and testable in Swagger.

### Data Model
Collection: `books`

Required fields:
- `id`: string (custom, e.g. `b1`)
- `authorId`: string (must match an existing author's `id`)
- `title`: string
- `publicationDate`: string (ISO 8601 date, e.g. `2021-08-17`)

### Relationship
`books.authorId` references `authors.id`.
POST and PUT reject with `400` if `authorId` does not match an existing author.

### Routes

#### GET /books
- 200: array of books
- 500: `{ "message": "Internal server error" }`

#### GET /books/:id
- 200: one book
- 404: `{ "message": "Book not found" }`
- 500: `{ "message": "Internal server error" }`

#### POST /books
Body:
```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}