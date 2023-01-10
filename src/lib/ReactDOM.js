// определяем корневой fiber волокно для начало работы
function render(element, container) {
	React.workingRoot = {
		node: container,
		props: {
			children: [element]
		},
		alternate: React.currentRoot,
	}

	React.nextUnitOfWork = React.workingRoot;
	React.nodesToRemove = [];
}



export default {
	render
}
