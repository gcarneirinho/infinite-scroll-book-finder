import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import icons from "./img/sprite.svg";
import ImageLoading from "./ImageLoading";
import "./App.scss";

function App() {
  const [busca, setBusca] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, error, loading } = useBookSearch(busca, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          //console.log("Visible");
          setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const mudaBusca = e => {
    setBusca(e.target.value);
    setPageNumber(1);
  };

  const iconSearch = (
    <svg
      className="search__icon"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <use xlinkHref={`${icons}#icon-magnifying-glass`}></use>
    </svg>
  );

  const iconClose = (
    <svg
      className="search__icon active"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <use xlinkHref={`${icons}#icon-circle-with-cross`}></use>
    </svg>
  );

  const clearBusca = () => setBusca("");

  return (
    <div className="App container">
      <header>
        <img src="" alt="" className="logo" />
        <form action="#" className="search">
          <input
            type="text"
            placeholder="Search Books"
            className="search__input"
            value={busca}
            onChange={mudaBusca}
          />
          <button className="search__button" onClick={clearBusca}>
            {busca.length === 0 ? iconSearch : iconClose}
          </button>
        </form>
      </header>
      {busca.length > 0 ? (
        <div className="resultado">
          Results for: <strong>{busca}</strong>{" "}
        </div>
      ) : null}

      <div className="results">
        <ul>
          {books.map((book, index) => {
            if (books.length === index + 1) {
              return (
                <li ref={lastBookElementRef} key={book}>
                  {book}
                </li>
              );
            } else {
              return <li key={book}>{book}</li>;
            }
          })}
        </ul>
      </div>

      <div>{loading && <ImageLoading />}</div>
      <div>{error && "Error"}</div>
    </div>
  );
}

export default App;
