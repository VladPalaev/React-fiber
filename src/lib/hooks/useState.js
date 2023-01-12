// для работы с fiber узлом, есть глобальная переменная React.workingFiber
export function useState(initialState) {
	const oldHook = React.workingFiber.alternate &&
					React.workingFiber.alternate.hooks &&
					React.workingFiber.alternate.hooks[React.hookIndex];
	// хук по сути это какой-то изначальный стейт и очередь из каких-то действий
	// по отношению к нему
	const hook = {
		state: oldHook ?
				oldHook.state :
				initialState instanceof Function ?
				initialState() :
				initialState,
		queue: [],
	};

	const actions = oldHook ? oldHook.queue : [];
	actions.forEach((action) => {
		hook.state = action instanceof Function ? action(hook.state) : action;
	})

	const setState = (action) => {
		hook.queue.push(action);

		// Вызываем ререндер компонента, React начнет обход fiber tree
		// recocle будет решать какой effectTag применять к node узлам
		React.workingRoot = {
			node: React.currentRoot.node,
			props: React.currentRoot.props,
			alternate: React.currentRoot
		}
		// Обнуляем некоторые browserGlobalVar для запуска ререндера и
		// и узлов для удаления.
		React.nextUnitOfWork = React.workingRoot;
		React.nodesToRemove = [];
	}

	React.workingFiber.hooks.push(hook);
	React.hookIndex += 1;

	return [hook.state, setState]
}
