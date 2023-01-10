export function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children
				.flat()
				.map((child) =>
				typeof child === "object" ? child : createTextNode(child)
			),
		},
	};
}

function createTextNode(nodeValue) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue,
			children: [],
		}
	}
}
