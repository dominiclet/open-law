import navbarStyles from '../../styles/Navbar.module.css';
import { Search } from 'react-bootstrap-icons';

const CaseSearch = () => {

	const handleSearch = () => {
		window.location.href = `/search?q=${document.getElementById("searchQ").value}`;
	}

	return (
		<div className={navbarStyles.searchContainer}>
			<input id="searchQ" type="text" className={navbarStyles.searchBar} placeholder="Search" />
			<Search onClick={handleSearch} className={navbarStyles.searchIcon} size="20" />
		</div>
	)
}

export default CaseSearch