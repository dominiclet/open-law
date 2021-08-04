import homeStyle from '../../styles/Home.module.css';
import { Discord, Search } from 'react-bootstrap-icons';
import Image from 'next/image';

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
		 <div className={homeStyle.imageContainer}>
			<Image className={homeStyle.bigBrainImage} src="/big_brain_boi_2.png" alt="Smiley face" width={250} height={250} />
		 </div>
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
		<div className={homeStyle.iconsContainer}>
			<Discord size="30" />
		</div>
      </div>
	);
}

export default LargeCaseSearch