import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from 'axios';
import { apiRoot } from "../../config";
import SearchResult from "../../components/search/SearchResult";
import searchResultStyle from "../../styles/SearchResult.module.css";
import { Spinner } from "react-bootstrap";

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
				<Spinner animation="border" />
			</div>
		);
	} else {
		return (
			<div className={searchResultStyle.searchResultContainer}>
				{searchResults.length > 0 ? searchResults.map(result => {
					return (
						<SearchResult 
							resultInfo={result}
						/>
					);
				}) : 
				<h5 style={{textAlign: "center"}}>
					Could not find the case you are looking for. Consider adding it? 🤗
				</h5>
				}
			</div>
		);
	}
}

export default searchPage