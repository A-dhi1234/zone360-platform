import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  products,
  formatPrice,
} from "../app/products";


function Products({
  toggleWishlist,
  isInWishlist,
}) {

  const [searchParams, setSearchParams] =
    useSearchParams();


  // =====================================================
  // SEARCH
  // =====================================================

  const urlSearch =
    searchParams.get("search") || "";

  const [search, setSearch] =
    useState(urlSearch);


  // =====================================================
  // CATEGORY
  // =====================================================

  const [category, setCategory] =
    useState("All");


  // =====================================================
  // PRICE FILTER
  // =====================================================

  const [maxPrice, setMaxPrice] =
    useState(5000);


  // =====================================================
  // SORT
  // =====================================================

  const [sortBy, setSortBy] =
    useState("recommended");


  // =====================================================
  // FILTER PANEL
  // =====================================================

  const [filtersOpen, setFiltersOpen] =
    useState(false);


  const categories = [
    "All",
    "Vehicle Tracking",
    "Employee Management",
    "Security",
    "Smart Automation",
  ];


  // =====================================================
  // SEARCH CHANGE
  // =====================================================

  const handleSearchChange = (event) => {

    const value =
      event.target.value;

    setSearch(value);

    if (value.trim()) {

      setSearchParams({
        search: value,
      });

    } else {

      setSearchParams({});

    }

  };


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {

    setSearch("");

    setSearchParams({});

  };


  // =====================================================
  // CLEAR ALL FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearch("");

    setCategory("All");

    setMaxPrice(5000);

    setSortBy("recommended");

    setSearchParams({});

  };


  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredProducts =
    useMemo(() => {

      let result =
        products.filter((product) => {

          const searchText =
            search
              .trim()
              .toLowerCase();


          const productName =
            product.name
              ?.toLowerCase() || "";


          const productShortName =
            product.shortName
              ?.toLowerCase() || "";


          const productCategory =
            product.category
              ?.toLowerCase() || "";


          const productDescription =
            product.description
              ?.toLowerCase() || "";


          // SEARCH

          const matchesSearch =
            !searchText ||

            productName.includes(
              searchText
            ) ||

            productShortName.includes(
              searchText
            ) ||

            productCategory.includes(
              searchText
            ) ||

            productDescription.includes(
              searchText
            );


          // CATEGORY

          const matchesCategory =
            category === "All" ||
            product.category === category;


          // PRICE

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
          (a, b) =>
            a.price - b.price
        );

      }


      if (sortBy === "price-high") {

        result.sort(
          (a, b) =>
            b.price - a.price
        );

      }


      if (sortBy === "name") {

        result.sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );

      }


      return result;

    }, [
      search,
      category,
      maxPrice,
      sortBy,
    ]);


  return (

    <section className="inner-page">

      <div className="container">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="page-heading">

          <span>
            OUR PRODUCTS
          </span>

          <h1>
            Smart Technology Solutions
          </h1>

          <p>
            Explore Zone360 tracking,
            security and automation products.
          </p>

        </div>


        {/* =================================================
            SEARCH + SORT
        ================================================= */}

        <div className="products-main-toolbar">

          <div className="product-search">

            <span>
              🔍
            </span>

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


          {/* SORT */}

          <div className="sort-control">

            <label>
              Sort by
            </label>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
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


          {/* MOBILE FILTER */}

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
              FILTER SIDEBAR
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


              {categories.map(
                (item) => (

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

                )
              )}

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

                <span>
                  ₹0
                </span>

                <span>
                  ₹5,000
                </span>

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
                  ⭐ 4+ Rating
                </span>

              </label>


              <small className="filter-note">
                Rating data will be connected
                when product reviews are added.
              </small>

            </div>


            {/* AVAILABILITY */}

            <div className="filter-section">

              <h4>
                Availability
              </h4>


              <label className="filter-option disabled">

                <input
                  type="checkbox"
                  disabled
                />

                <span>
                  In Stock
                </span>

              </label>


              <small className="filter-note">
                Stock information will be
                connected later.
              </small>

            </div>

          </aside>


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="products-results">

            <div className="products-result-header">

              <div>

                <strong>
                  {filteredProducts.length}
                </strong>

                {" "}

                product
                {filteredProducts.length !== 1
                  ? "s"
                  : ""}


                {search.trim() && (

                  <span>
                    {" "}for "{search}"
                  </span>

                )}

              </div>


              {(search ||
                category !== "All" ||
                maxPrice < 5000) && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-results-button"
                >
                  Clear Filters
                </button>

              )}

            </div>


            {/* PRODUCT GRID */}

            {filteredProducts.length > 0 ? (

              <div className="product-grid product-page-grid">

                {filteredProducts.map(
                  (product) => (

                    <ProductItem
                      key={product.id}
                      product={product}
                      toggleWishlist={
                        toggleWishlist
                      }
                      isInWishlist={
                        isInWishlist
                      }
                    />

                  )
                )}

              </div>

            ) : (

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

  const wishlistActive =
    isInWishlist
      ? isInWishlist(product.id)
      : false;


  const handleWishlistClick = (
    event
  ) => {

    event.preventDefault();

    event.stopPropagation();

    if (toggleWishlist) {

      toggleWishlist(product);

    }

  };


  return (

    <div className="product-card-wrapper">

      {/* =================================================
          WISHLIST BUTTON
      ================================================= */}

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

        {wishlistActive
          ? "♥"
          : "♡"}

      </button>


      {/* =================================================
          PRODUCT CARD
      ================================================= */}

      <Link
        to={`/products/${product.id}`}
        className="product-card"
      >

        <div className="product-image">

          {product.image ? (

            <img
              src={product.image}
              alt={product.name}
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