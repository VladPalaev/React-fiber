window.React = {
	nextUnitOfWork: null,
	workingRoot: null,
	currentRoot: null,
	nodesToRemove: null,
	hookIndex: null,
	workingFiber: null, // для работы хуков, для доступа из компонента к fiber
}
