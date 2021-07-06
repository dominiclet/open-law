import navbarStyles from '../styles/Navbar.module.css';
import { Search } from 'react-bootstrap-icons';

const CaseSearch = () => {
	return (
		<div className={navbarStyles.searchContainer}>
			<input type="text" className={navbarStyles.searchBar} placeholder="Search" />
			<Search className={navbarStyles.searchIcon} size="20" />
		</div>
	)
}

export default CaseSearch