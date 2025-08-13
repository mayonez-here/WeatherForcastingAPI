import React, { useState, useEffect, useRef } from "react";

const GEO_API_KEY = "80ea735015cd0b875e634f260f4c871b";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  }, [query]);

  async function fetchSuggestions(input) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${GEO_API_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSelectSuggestion(city) {
    const cityString = `${city.name}, ${city.state || ""} ${city.country}`.trim();
    setQuery(cityString);
    setShowSuggestions(false);
    onSearch(cityString);
    if (inputRef.current) inputRef.current.blur();
  }

  function handleSubmit(e) {
    e.preventDefault();
    setShowSuggestions(false);
    if (query.trim()) onSearch(query.trim());
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !event.target.closest(".autocomplete-suggestions")
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSubmit} className="searchbar-form">
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter city name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className="searchbar-input"
        />
        <button type="submit" className="searchbar-button">
          Search
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((city, idx) => (
            <li
              key={`${city.lat}-${city.lon}-${idx}`}
              className="autocomplete-suggestion-item"
              onClick={() => handleSelectSuggestion(city)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {city.name}, {city.state ? city.state + ", " : ""}
              {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
