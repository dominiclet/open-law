import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from 'axios';
import { apiRoot } from "../../config";
import SearchResult from "../../components/search/SearchResult";
import searchResultStyle from "../../styles/SearchResult.module.css";

const searchPage = () => {
	const router = useRouter();
	// State to check if data has loaded
	const [dataLoaded, setDataLoaded] = useState(false);
	// State to store loaded data
	const [searchResults, setSearchResults] = useState();

	// Fetch results of search
	useEffect(() => {
		axios.get(apiRoot + "/search", {params: {q: router.query.q}})
			.then(res => {
				setSearchResults(res.data);
				setDataLoaded(true);
			});
	}, []);

	if (!dataLoaded) {
		return (
			<div>
				Loading...
			</div>
		);
	} else {
		return (
			<div className={searchResultStyle.searchResultContainer}>
				{searchResults.map(result => {
					return (
						<SearchResult 
							resultInfo={result}
						/>
					);
				})}
			</div>
		);
	}
}

export default searchPage