import { useCallback, useRef, useState } from 'react';
import useBookSearch from './useBookSearch';
import './App.css';

function App() {
	const [query, setQuery] = useState('');
	const [pageNumber, setPageNumber] = useState(1);
	const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

	const observer = useRef();
	const lastBookElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber((prevPageNumber) => prevPageNumber + 1);
					console.log('hell yeah');
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	const handleSearch = (e) => {
		setQuery(e.target.value);
		setPageNumber(1);
	};

	return (
		<main className="container">
			<h2>INFINITE SCROLLING WITH REACT</h2>
			<p>
				Powered By{' '}
				<a
					href="https://openlibrary.org/"
					target="_blank"
					rel="noopener noreferrer">
					Open Library API
				</a>
			</p>
			<input
				className="searchBar"
				type="text"
				value={query}
				onChange={handleSearch}
				placeholder="Enter Book Name Here"
			/>
			{books.map((book, index) => {
				if (books.length - 20 === index + 1) {
					return (
						<div className="bookList" ref={lastBookElementRef} key={book}>
							{book}
						</div>
					);
				} else {
					return (
						<div className="bookList" key={book}>
							{book}
						</div>
					);
				}
			})}
			{loading && <div className="loader">Loading...</div>}
			{error && <div className="displayError">Error</div>}
		</main>
	);
}

export default App;
