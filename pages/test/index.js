import { useEffect } from 'react';

const testPage = () => {
	const Diff = require('diff');
	const one = 'beep boop';
	const other = 'beep boob blah';

	useEffect(() => {
		const diff = Diff.diffChars(one, other);

		const display = document.getElementById("display");
		const fragment = document.createDocumentFragment();
		let span = null;
		
		diff.forEach(part => {
			const color = part.added ? 'green' :
				part.removed ? 'red' : 'grey';
			span = document.createElement('span');
			span.style.color = color;
			span.appendChild(document.createTextNode(part.value));
			fragment.appendChild(span);
		});
		display.appendChild(fragment);
	}, []);

	return (
		<pre id="display">

		</pre>
	);
}

export default testPage