import React, { useMemo, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { products } from "../app/products";


function Navbar({
  cartItemCount = 0,
  wishlistItemCount = 0,
}) {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");


  // =====================================================
  // RECENT SEARCHES
  // =====================================================

  const [recentSearches, setRecentSearches] =
    useState(() => {

      try {

        const saved =
          localStorage.getItem(
            "zone360-recent-searches"
          );

        return saved
          ? JSON.parse(saved)
          : [];

      } catch {

        return [];

      }

    });


  const location = useLocation();

  const navigate = useNavigate();


  // =====================================================
  // CLOSE MENU
  // =====================================================

  const closeMenu = () => {

    setMenuOpen(false);

  };


  // =====================================================
  // ACTIVE NAVIGATION
  // =====================================================

  const isActive = (path) => {

    if (path === "/") {

      return location.pathname === "/";

    }

    return location.pathname.startsWith(path);

  };


  // =====================================================
  // SAVE RECENT SEARCH
  // =====================================================

  const saveRecentSearch = (value) => {

    const searchValue =
      value.trim();


    if (!searchValue) {
      return;
    }


    setRecentSearches(
      (currentSearches) => {

        const filtered =
          currentSearches.filter(
            (item) =>
              item.toLowerCase() !==
              searchValue.toLowerCase()
          );


        const updated = [
          searchValue,
          ...filtered,
        ].slice(0, 5);


        localStorage.setItem(
          "zone360-recent-searches",
          JSON.stringify(updated)
        );


        return updated;

      }
    );

  };


  // =====================================================
  // SEARCH SUGGESTIONS
  // =====================================================

  const suggestions = useMemo(() => {

    const value =
      searchText
        .trim()
        .toLowerCase();


    if (!value) {

      return [];

    }


    return products
      .filter((product) => {

        const name =
          product.name?.toLowerCase() || "";

        const shortName =
          product.shortName?.toLowerCase() || "";

        const category =
          product.category?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";


        return (
          name.includes(value) ||
          shortName.includes(value) ||
          category.includes(value) ||
          description.includes(value)
        );

      })
      .slice(0, 5);

  }, [searchText]);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (event) => {

    event.preventDefault();


    const value =
      searchText.trim();


    if (!value) {

      navigate("/products");

      return;

    }


    saveRecentSearch(value);


    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );


    setSearchOpen(false);

    setSearchText("");

    closeMenu();

  };


  // =====================================================
  // RECENT SEARCH CLICK
  // =====================================================

  const handleRecentSearchClick = (
    value
  ) => {

    saveRecentSearch(value);


    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );


    setSearchOpen(false);

    setSearchText("");

  };


  // =====================================================
  // REMOVE RECENT SEARCH
  // =====================================================

  const removeRecentSearch = (
    event,
    value
  ) => {

    event.stopPropagation();


    setRecentSearches(
      (currentSearches) => {

        const updated =
          currentSearches.filter(
            (item) => item !== value
          );


        localStorage.setItem(
          "zone360-recent-searches",
          JSON.stringify(updated)
        );


        return updated;

      }
    );

  };


  // =====================================================
  // CLEAR RECENT SEARCHES
  // =====================================================

  const clearRecentSearches = () => {

    localStorage.removeItem(
      "zone360-recent-searches"
    );

    setRecentSearches([]);

  };


  // =====================================================
  // SUGGESTION CLICK
  // =====================================================

  const handleSuggestionClick = (
    productId
  ) => {

    const product =
      products.find(
        (item) =>
          item.id === productId
      );


    if (product) {

      saveRecentSearch(product.name);

    }


    navigate(
      `/products/${productId}`
    );


    setSearchOpen(false);

    setSearchText("");

  };


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {

    setSearchText("");

  };


  // =====================================================
  // OPEN SEARCH
  // =====================================================

  const openSearch = () => {

    setSearchOpen(
      (current) => !current
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <>

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="top-bar">

        <div className="container top-bar-inner">

          <div>
            Smart Technology | Secure Tomorrow
          </div>


          <div className="top-contact">

            <span>
              📞 +91 80478 27022
            </span>

            <span>
              ✉ zone360.cbe@gmail.com
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">

        <div className="container navbar-inner">

          {/* LOGO */}

          <Link
            to="/"
            className="brand"
            onClick={closeMenu}
          >

            <img
              src="/assets/logo.png"
              alt="Zone360 Logo"
            />

          </Link>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="desktop-nav">

            <Link
              to="/"
              className={
                isActive("/")
                  ? "active"
                  : ""
              }
            >
              Home
            </Link>


            <Link
              to="/products"
              className={
                isActive("/products")
                  ? "active"
                  : ""
              }
            >
              Products
            </Link>


            <Link
              to="/app"
              className={
                isActive("/app")
                  ? "active"
                  : ""
              }
            >
              Zone360 App
            </Link>


            <Link
              to="/about"
              className={
                isActive("/about")
                  ? "active"
                  : ""
              }
            >
              About Us
            </Link>


            <Link
              to="/contact"
              className={
                isActive("/contact")
                  ? "active"
                  : ""
              }
            >
              Contact Us
            </Link>

          </nav>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="navbar-actions">

            {/* SEARCH */}

            <button
              type="button"
              className="search-button"
              onClick={openSearch}
              aria-label="Search"
            >
              🔍
            </button>


            {/* WISHLIST */}

            <Link
              to="/wishlist"
              className={
                isActive("/wishlist")
                  ? "wishlist-button active"
                  : "wishlist-button"
              }
              aria-label="Wishlist"
            >

              <span className="wishlist-symbol">
                ♡
              </span>


              {wishlistItemCount > 0 && (

                <span className="wishlist-count">
                  {wishlistItemCount}
                </span>

              )}

            </Link>


            {/* CART */}

            <Link
              to="/cart"
              className="cart-button"
              aria-label="Shopping Cart"
            >

              <span className="cart-symbol">
                🛒
              </span>


              {cartItemCount > 0 && (

                <span className="cart-count">
                  {cartItemCount}
                </span>

              )}

            </Link>


            {/* LOGIN */}

            <Link
              to="/login"
              className="login-link"
            >
              Login
            </Link>


            {/* QUOTE */}

            <Link
              to="/quote"
              className="quote-button"
            >
              Get a Quote
            </Link>


            {/* MOBILE MENU */}

            <button
              type="button"
              className="mobile-menu-button"
              onClick={() =>
                setMenuOpen(
                  (current) => !current
                )
              }
              aria-label="Open Menu"
            >
              ☰
            </button>

          </div>

        </div>


        {/* =================================================
            SEARCH PANEL
        ================================================= */}

        {searchOpen && (

          <div className="search-panel">

            <div className="container">

              <form
                className="navbar-search-form"
                onSubmit={handleSearch}
              >

                <span className="navbar-search-icon">
                  🔍
                </span>


                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                  autoFocus
                />


                {searchText && (

                  <button
                    type="button"
                    className="search-clear-button"
                    onClick={clearSearch}
                  >
                    ✕
                  </button>

                )}


                <button
                  type="submit"
                  className="search-submit-button"
                >
                  Search
                </button>

              </form>


              {/* =================================================
                  RECENT SEARCHES
              ================================================= */}

              {!searchText.trim() &&
                recentSearches.length > 0 && (

                  <div className="search-suggestions">

                    <div className="recent-search-header">

                      <span>
                        Recent Searches
                      </span>

                      <button
                        type="button"
                        onClick={
                          clearRecentSearches
                        }
                      >
                        Clear all
                      </button>

                    </div>


                    {recentSearches.map(
                      (item) => (

                        <div
                          className="recent-search-item"
                          key={item}
                        >

                          <button
                            type="button"
                            className="recent-search-main"
                            onClick={() =>
                              handleRecentSearchClick(
                                item
                              )
                            }
                          >

                            <span className="recent-search-icon">
                              🕘
                            </span>

                            <span>
                              {item}
                            </span>

                          </button>


                          <button
                            type="button"
                            className="recent-search-remove"
                            onClick={(event) =>
                              removeRecentSearch(
                                event,
                                item
                              )
                            }
                            aria-label={
                              `Remove ${item}`
                            }
                          >
                            ✕
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}


              {/* =================================================
                  LIVE SUGGESTIONS
              ================================================= */}

              {searchText.trim() && (

                <div className="search-suggestions">

                  {suggestions.length > 0 ? (

                    <>

                      <div className="search-suggestions-title">
                        Products
                      </div>


                      {suggestions.map(
                        (product) => (

                          <button
                            type="button"
                            className="search-suggestion-item"
                            key={product.id}
                            onClick={() =>
                              handleSuggestionClick(
                                product.id
                              )
                            }
                          >

                            <div className="search-suggestion-image">

                              {product.image ? (

                                <img
                                  src={product.image}
                                  alt={product.name}
                                />

                              ) : (

                                <span>
                                  Z360
                                </span>

                              )}

                            </div>


                            <div className="search-suggestion-content">

                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                {product.category}
                              </span>

                            </div>


                            <span className="search-suggestion-arrow">
                              →
                            </span>

                          </button>

                        )
                      )}

                    </>

                  ) : (

                    <div className="search-no-results">

                      <strong>
                        No products found
                      </strong>

                      <span>
                        Try another product name
                        or category.
                      </span>

                    </div>

                  )}


                  {suggestions.length > 0 && (

                    <button
                      type="button"
                      className="search-view-all"
                      onClick={handleSearch}
                    >
                      View all search results →
                    </button>

                  )}

                </div>

              )}

            </div>

          </div>

        )}


        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {menuOpen && (

          <div className="mobile-nav">

            <Link
              to="/"
              onClick={closeMenu}
            >
              Home
            </Link>


            <Link
              to="/products"
              onClick={closeMenu}
            >
              Products
            </Link>


            <Link
              to="/wishlist"
              onClick={closeMenu}
            >
              Wishlist

              {wishlistItemCount > 0 && (
                ` (${wishlistItemCount})`
              )}

            </Link>


            <Link
              to="/cart"
              onClick={closeMenu}
            >
              Cart

              {cartItemCount > 0 && (
                ` (${cartItemCount})`
              )}

            </Link>


            <Link
              to="/app"
              onClick={closeMenu}
            >
              Zone360 App
            </Link>


            <Link
              to="/about"
              onClick={closeMenu}
            >
              About Us
            </Link>


            <Link
              to="/contact"
              onClick={closeMenu}
            >
              Contact Us
            </Link>


            <Link
              to="/login"
              onClick={closeMenu}
            >
              Login
            </Link>


            <Link
              to="/quote"
              onClick={closeMenu}
            >
              Get a Quote
            </Link>

          </div>

        )}

      </header>

    </>

  );

}


export default Navbar;
