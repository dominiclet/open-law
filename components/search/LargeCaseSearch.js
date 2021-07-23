import homeStyle from '../../styles/Home.module.css';
import { Search } from 'react-bootstrap-icons';


const LargeCaseSearch = () => {
	// Handles enter functionality: Searches case with query
	const handleEnterKey = (e) => {
		if (e.key === "Enter") {
			const q = document.getElementById("largeSearchQ").value;
			if (q) {
				window.location.href = `/search?q=${q}`;
			}
		}
	}

	return (
      <div className={homeStyle.searchContainer}>
        <input 
          placeholder="Search cases"
		  id="largeSearchQ"
          className={homeStyle.searchBar} 
          type="text"
		  onKeyDown={handleEnterKey}
        />
        <Search 
          className={homeStyle.searchIcon} 
          size="17"
        />
      </div>
	);
}

export default LargeCaseSearch