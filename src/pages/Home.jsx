import useFetch from "../../useFetch";
import { Link } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

export default function Home() {

  const { searchBook } = useSearch();

  // Fetch genres
  const {
    data: genresData,
    loading: genresLoading,
    error: genresError,
  } = useFetch("http://localhost:3000/api/genres");
  const genres = genresData?.data?.genres || [];

  // Fetch all books
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useFetch("http://localhost:3000/api/books");
  const books = booksData?.data?.books || [];

  // Filter books by search term
  const filteredBooks = books.filter((book) =>{
    const searchMatch = searchBook
      ? book.title.toLowerCase().includes(searchBook.toLowerCase())
      : true
      return searchMatch
  }
  );

  return (
    <>
     (
        <section className="container py-2 my-4">
          <h2>Shop By Genre:</h2>
          {genresLoading ? (
            <p>Loading genres...</p>
          ) : genresError ? (
            <p className="text-danger">Error loading genres.</p>
          ) : (
            <div className="row">
              {genres.map((genre) => (
                <div className="col-md-6 mb-4" key={genre}>
                  <Link to={`/genre/${genre}`} className="text-decoration-none">
                    <div className="card p-4 m-2 bg-warning rounded-3 shadow border-0">
                      <h3 className="text-light">{genre}</h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      <section className="container py-4 my-4">
        <img
          src="https://images.unsplash.com/photo-1583526241256-cb18e8635e5b?q=80&w=1170&auto=format&fit=crop"
          className="img-fluid w-100"
          style={{ height: "500px", objectFit: "cover", borderRadius: "5px" }}
          alt="Books banner"
        />
      </section>

      <section className="container py-2 my-4">
        <div className="card">
          <div className="card-body">
            <figure>
              <blockquote className="blockquote">
                <p>A reader lives a thousand lives before he dies.</p>
              </blockquote>
              <figcaption className="blockquote-footer">
                George R.R. Martin <cite>A Dance With Dragons</cite>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>


      )

    </>
  );
}
