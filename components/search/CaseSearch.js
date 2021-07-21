import navbarStyles from '../../styles/Navbar.module.css';
import { Search } from 'react-bootstrap-icons';

// Not in use

const CaseSearch = () => {

	// Handles search functionality: Redirects to search page
	const handleSearch = () => {
		window.location.href = `/search?q=${document.getElementById("searchQ").value}`;
	}

	// Handles enter functionality
	const handleEnterKey = (e) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	}

	return (
		<div className={navbarStyles.searchContainer}>
			<input id="searchQ" onKeyPress={handleEnterKey} type="text" className={navbarStyles.searchBar} placeholder="Search" />
			<Search onClick={handleSearch} className={navbarStyles.searchIcon} size="20" />
		</div>
	)
}

export default CaseSearch