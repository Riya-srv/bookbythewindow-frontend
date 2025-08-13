import { useParams,Link } from "react-router-dom";
import useFetch from "../../useFetch";
import FilterBar from "../components/FilterBar";
import { useState } from "react";
import { useSearch } from "../context/SearchContext";

export default function GenreBooks() {
  const { searchBook } = useSearch(); // get search term from context

  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinRating("");
    setMaxPrice(500);
    setSortOrder("");
  };

  const { genreName } = useParams();
  const { data, loading, error } = useFetch(
    `http://localhost:3000/api/books/genre/${genreName}`
  );

  const books = data?.data?.books || [];

  const filteredBooks = books.filter((book) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(book.category);

    const ratingMatch = !minRating || book.rating >= minRating;

    const priceMatch = book.price <= maxPrice;

    const searchMatch =
      !searchBook ||
      book.title.toLowerCase().includes(searchBook.toLowerCase());

    return categoryMatch && ratingMatch && priceMatch && searchMatch;
  });

  if (sortOrder === "asc") {
    filteredBooks.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filteredBooks.sort((a, b) => b.price - a.price);
  }

  return (
    <section className="container my-4">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-md-3">
          <FilterBar
            genreName={genreName}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            minRating={minRating}
            setMinRating={setMinRating}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            clearFilters={clearFilters}
          />
        </aside>

        {/* Book Listing */}
        <div className="col-md-9">
          {loading && <p>Loading...</p>}
          {error && <p>Something went wrong.</p>}
          <div className="row">
            {filteredBooks.map((book) => (
              <div className="col-md-4 mb-4" key={book._id}>
                    <Link to={`/books/${book._id}`} className="text-decoration-none text-dark">
                <div className="card h-100">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text text-muted">{book.author}</p>
                  </div>
                  <h6 className="text-center">₹{book.price}</h6>
                  <button className="btn btn-warning btn-sm w-100 mx-auto">
                    Add to Cart
                  </button>
                </div>
                </Link>
              </div>
            ))}
            {!loading && filteredBooks.length === 0 && (
              <p>No books found for selected category.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}