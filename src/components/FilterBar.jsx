import { useEffect, useState } from "react";

export default function FilterBar({ genreName, selectedCategories, setSelectedCategories, minRating,
  setMinRating, maxPrice, setMaxPrice, sortOrder, setSortOrder, clearFilters }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`https://bookbythewindow-backend-tusv.vercel.app/api/categories/genre/${genreName}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data.categories || []);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [genreName]);

  const handleCheckboxChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="border-end pe-3">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="mb-0">Filters</h5>
    <button
      className="btn btn-warning"
      onClick={clearFilters}
    >
      Clear
    </button>
  </div>

      <div className="mb-4">
  <h5>Price</h5>
  <input
    type="range"
    min="0"
    max="1000"
    step="50"
    value={maxPrice}
    onChange={(e) => setMaxPrice(Number(e.target.value))}
    className="form-range"
  />
  <div className="d-flex justify-content-between">
    <span>₹0</span>
    <span>₹{maxPrice}</span>
    <span>₹1000</span>
  </div>
</div>

      <h5 className="mb-3">Category</h5>
      <form>
        {categories.map((cat) => (
          <div className="form-check mb-2" key={cat._id}>
            <input
              className="form-check-input"
              type="checkbox"
              id={cat._id}
              checked={selectedCategories.includes(cat._id)}
              onChange={() => handleCheckboxChange(cat._id)}
            />
            <label className="form-check-label" htmlFor={cat._id}>
              {cat.name}
            </label>
          </div>
                
        ))}
      </form>
<div className="mt-4">
  <h5>Rating</h5>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="rating"
      id="rating-4"
      checked={minRating === 4}
      onChange={() => setMinRating(4)}
    />
    <label className="form-check-label" htmlFor="rating-4">
      4 Stars & above
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="rating"
      id="rating-3"
      checked={minRating === 3}
      onChange={() => setMinRating(3)}
    />
    <label className="form-check-label" htmlFor="rating-3">
      3 Stars & above
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="rating"
      id="rating-2"
      checked={minRating === 2}
      onChange={() => setMinRating(2)}
    />
    <label className="form-check-label" htmlFor="rating-2">
      2 Stars & above
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="rating"
      id="rating-1"
      checked={minRating === 1}
      onChange={() => setMinRating(1)}
    />
    <label className="form-check-label" htmlFor="rating-1">
      1 Star & above
    </label>
  </div>
  <div className="mt-4">
  <h5>Sort by</h5>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="sort"
      id="sort-low"
      checked={sortOrder === "asc"}
      onChange={() => setSortOrder("asc")}
    />
    <label className="form-check-label" htmlFor="sort-low">
      Price - Low to High
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="sort"
      id="sort-high"
      checked={sortOrder === "desc"}
      onChange={() => setSortOrder("desc")}
    />
    <label className="form-check-label" htmlFor="sort-high">
      Price - High to Low
    </label>
  </div>
</div>

</div>

    </div>
  );
}
