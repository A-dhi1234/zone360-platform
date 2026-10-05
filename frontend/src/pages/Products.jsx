import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { formatPrice } from "../app/products";
import { getProducts } from "../api";

function Products({
  toggleWishlist,
  isInWishlist,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ===================================================
  // LOAD PRODUCTS FROM BACKEND
  // ===================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        const formattedProducts = data.map((product) => {
          return {
            ...product,

            // Backend uses snake_case
            // Frontend uses camelCase
            shortName: product.short_name,

            // Keep the real database ID
            id: product.id,
          };
        });

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Product API error:", err);

        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ===================================================
  // CATEGORIES
  // ===================================================

  const categories = [
    "All",
    "Vehicle Tracking",
    "Employee Management",
    "Security",
    "Smart Automation",
  ];

  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);

    if (value.trim()) {
      setSearchParams({
        search: value,
      });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearch("");
    setSearchParams({});
  };

  // ===================================================
  // CLEAR FILTERS
  // ===================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice(5000);
    setSortBy("recommended");
    setSearchParams({});
  };

  // ===================================================
  // FILTER PRODUCTS
  // ===================================================

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchText = search.trim().toLowerCase();

      const productName =
        product.name?.toLowerCase() || "";

      const productShortName =
        product.shortName?.toLowerCase() || "";

      const productCategory =
        product.category?.toLowerCase() || "";

      const productDescription =
        product.description?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        productName.includes(searchText) ||
        productShortName.includes(searchText) ||
        productCategory.includes(searchText) ||
        productDescription.includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesPrice =
        product.price <= maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );
    });

    // =================================================
    // SORT
    // =================================================

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sortBy === "name") {
      result.sort(
        (a, b) => a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    maxPrice,
    sortBy,
  ]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <section className="inner-page">
        <div className="container">
          <div className="page-heading">
            <span>OUR PRODUCTS</span>

            <h1>
              Smart Technology Solutions
            </h1>

            <p>
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <section className="inner-page">
        <div className="container">
          <div className="page-heading">
            <span>OUR PRODUCTS</span>

            <h1>
              Unable to Load Products
            </h1>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ===================================================
  // MAIN PAGE
  // ===================================================

  return (
    <section className="inner-page">
      <div className="container">

        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="page-heading">
          <span>OUR PRODUCTS</span>

          <h1>
            Smart Technology Solutions
          </h1>

          <p>
            Explore Zone360 tracking,
            security and automation products.
          </p>
        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="products-main-toolbar">

          <div className="product-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />

            {search && (
              <button
                type="button"
                className="product-search-clear"
                onClick={clearSearch}
              >
                ✕
              </button>
            )}

          </div>

          <div className="sort-control">

            <label>
              Sort by
            </label>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="recommended">
                Recommended
              </option>

              <option value="price-low">
                Price: Low → High
              </option>

              <option value="price-high">
                Price: High → Low
              </option>

              <option value="name">
                Name: A → Z
              </option>
            </select>

          </div>

          <button
            type="button"
            className="mobile-filter-button"
            onClick={() =>
              setFiltersOpen(
                (current) => !current
              )
            }
          >
            ☰ Filters
          </button>

        </div>

        {/* =================================================
            PRODUCTS LAYOUT
        ================================================= */}

        <div className="products-layout">

          {/* =================================================
              FILTERS
          ================================================= */}

          <aside
            className={
              filtersOpen
                ? "product-filters open"
                : "product-filters"
            }
          >

            <div className="filter-header">

              <h3>
                Filters
              </h3>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear All
              </button>

            </div>

            {/* CATEGORY */}

            <div className="filter-section">

              <h4>
                Category
              </h4>

              {categories.map((item) => (
                <label
                  className="filter-option"
                  key={item}
                >

                  <input
                    type="radio"
                    name="category"
                    checked={
                      category === item
                    }
                    onChange={() =>
                      setCategory(item)
                    }
                  />

                  <span>
                    {item}
                  </span>

                </label>
              ))}

            </div>

            {/* PRICE */}

            <div className="filter-section">

              <h4>
                Maximum Price
              </h4>

              <div className="price-filter-value">

                <strong>
                  {formatPrice(maxPrice)}
                </strong>

              </div>

              <input
                type="range"
                min="0"
                max="5000"
                step="500"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    Number(event.target.value)
                  )
                }
                className="price-range"
              />

              <div className="price-range-labels">
                <span>₹0</span>
                <span>₹5,000</span>
              </div>

            </div>

            {/* RATING */}

            <div className="filter-section">

              <h4>
                Rating
              </h4>

              <label className="filter-option disabled">

                <input
                  type="checkbox"
                  disabled
                />

                <span>
                  Rating filter coming soon
                </span>

              </label>

            </div>

          </aside>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="products-grid">

            {filteredProducts.length === 0 ? (

              <div className="no-products">

                <div className="no-products-icon">
                  🔍
                </div>

                <h2>
                  No Products Found
                </h2>

                <p>
                  Try changing your search
                  or filters.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              filteredProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  toggleWishlist={toggleWishlist}
                  isInWishlist={isInWishlist}
                />
              ))

            )}

          </div>

        </div>

      </div>
    </section>
  );
}

// =====================================================
// PRODUCT ITEM
// =====================================================

function ProductItem({
  product,
  toggleWishlist,
  isInWishlist,
}) {
  const wishlistActive = isInWishlist
    ? isInWishlist(product.id)
    : false;

  const handleWishlistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (toggleWishlist) {
      toggleWishlist(product);
    }
  };

  // =====================================================
  // IMAGE URL FIX
  // =====================================================

  const getProductImage = () => {
    if (!product.image) {
      return null;
    }

    // Backend currently returns:
    // /src/assets/gps-tracker.png
    //
    // Frontend public folder contains:
    // /public/assets/gps-tracker.png
    //
    // Therefore convert it to:
    // /assets/gps-tracker.png

    if (
      product.image.startsWith("/src/assets/")
    ) {
      return product.image.replace(
        "/src/assets/",
        "/assets/"
      );
    }

    return product.image;
  };

  const productImage = getProductImage();

  return (
    <div className="product-card-wrapper">

      <button
        type="button"
        className={
          wishlistActive
            ? "product-wishlist-button active"
            : "product-wishlist-button"
        }
        onClick={handleWishlistClick}
        aria-label={
          wishlistActive
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        {wishlistActive ? "♥" : "♡"}
      </button>

      <Link
        to={`/products/${product.id}`}
        className="product-card"
      >

        {/* =================================================
            PRODUCT IMAGE
        ================================================= */}

        <div className="product-image">

          {productImage ? (

            <img
              src={productImage}
              alt={product.name}
              loading="lazy"
              onError={(event) => {
                console.error(
                  "Product image failed:",
                  productImage
                );

                event.currentTarget.style.display =
                  "none";
              }}
            />

          ) : (

            <div className="product-placeholder">

              <div>
                Z360
              </div>

              <span>
                Smart Automation
              </span>

            </div>

          )}

        </div>

        {/* =================================================
            PRODUCT CONTENT
        ================================================= */}

        <div className="product-card-content">

          <span className="product-category">
            {product.category}
          </span>

          <h3>
            {product.name}
          </h3>

          <p>
            {product.description}
          </p>

          <div className="product-card-bottom">

            <span className="product-price">
              {formatPrice(product.price)}
            </span>

            <span className="product-arrow">
              →
            </span>

          </div>

        </div>

      </Link>

    </div>
  );
}

export default Products;