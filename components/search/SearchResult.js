import { Card, Badge } from "react-bootstrap"
import searchResultStyle from "../../styles/SearchResult.module.css";

const SearchResult = (props) => {
	// props.resultInfo: Search result relating to this particular case

	const date = new Date(props.resultInfo.lastEdit);
	return (
		<Card className={searchResultStyle.searchResult}>
			<Card.Header className={searchResultStyle.searchResultHeader}>
				<div>
					{props.resultInfo.name}
				</div>
				<div>
					{props.resultInfo.tag.map(tag => {
						return <Badge className={searchResultStyle.tag} pill variant="dark">{tag}</Badge>
					})}
				</div>
			</Card.Header>
			<Card.Body className={searchResultStyle.searchResultBody}>
				<Card.Text>
					<div>
						{props.resultInfo.citation.join("; ")}
					</div>
				</Card.Text>
			</Card.Body>
			<Card.Footer className={searchResultStyle.searchResultFooter}>
				<small className="text-muted">{
					`Last edited by ${props.resultInfo.lastEditBy} on 
					${date.toLocaleDateString("en-SG")} at 
					${date.toLocaleTimeString("en-SG")}`
				}</small>
			</Card.Footer>
		</Card>
	);
}

export default SearchResult