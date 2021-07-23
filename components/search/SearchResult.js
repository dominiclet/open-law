import { Card, Badge } from "react-bootstrap"
import searchResultStyle from "../../styles/SearchResult.module.css";
import Link from 'next/link';

const SearchResult = (props) => {
	// props.resultInfo: Search result relating to this particular case

	const date = new Date(props.resultInfo.lastEdit);
	return (
		<Card className={searchResultStyle.searchResult}>
			<Card.Header className={searchResultStyle.searchResultHeader}>
				<div>
					<Link href={`/case/${props.resultInfo._id}`}>
						{props.resultInfo.name}
					</Link>
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
						<p className={searchResultStyle.innerHeader}>Citation</p>
						<p>{props.resultInfo.citation.join("; ")}</p>
					</div>
					<div>
						<p className={searchResultStyle.innerHeader}>Issues</p>
						<ol>
							{props.resultInfo.issues.map((issue) => {
								return <li>{issue}</li>;
							})}
						</ol>
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