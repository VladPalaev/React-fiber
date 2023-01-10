// создаем из fiber и возвращаем готовый dom елемент
export function createNode(fiber) {
	const node = fiber.type === 'TEXT_ELEMENT'
				? document.createTextNode('')
				: document.createElement(fiber.type);

	const {children, ...props} = fiber.props;

	Object.entries(props).forEach(([key, value]) => {
		node[key] = value;
	});

	return node;
}
