import Nav from "../components/Nav"
import { useParams } from "react-router-dom"
import useFetch from "../../useFetch"

export default function BookDetails(){
    const { bookId } = useParams();

    const { data:bookData, loading, error } = useFetch(`https://bookbythewindow-backend-tusv.vercel.app/api/book/${bookId}`)

    const book = bookData?.data?.book;

    if(loading) return <div className="container my-5">Loading...</div>
    if(error) return <div className="container my-5">Error loading Book details.</div>
    if (!book) return <p>No book found.</p>;
    
    return(
        <div className="container py-3">
            <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <img
              src={book.coverImageUrl || "https://via.placeholder.com/300x400"}
              alt={book.title}
              className="img-fluid border"
              style={{width: "300px", height: "400px", objectFit: "cover"}}
            />
          </div>
          <div>
            {/* Thumbnail */}
            <img
              src={book.coverImageUrl || "https://via.placeholder.com/80x100"}
              alt={book.title}
              className="img-thumbnail"
              style={{ width: "80px", height: "100px" }}
            />
          </div>
        </div>
            <div className="col-md-6">
                <h2 className="fw-bold">{book.title}</h2>
                <p className="text-primary">{book.author}</p>

                <div>
                    <span className="fs-4 fw-bold text-success">Rs. {book.price}</span>
                </div>

                <div className="d-flex gap-3 mb-4 mt-4">
                    <button className="btn btn-outline-dark btn-lg">ADD TO CART</button>
                    <button className="btn btn-dark btn-lg">ADD TO WISHLIST</button>
                </div>
                <div className="mt-4">
                    <h4>Description</h4>
                    <p>{book.description}</p>
                </div>
            </div>
        </div>
        </div>
    )
}