// У текущего fiber берем его детей(elements), так же мы еще смотрим его в
// alternate и забираем его детей в oldFiber
export function reconcileChildren(workingFiber, elements) {
    let index = 0;
    let prevSibling = null;
    let oldFiber = workingFiber.alternate && workingFiber.alternate.child;

	// обязательно нестрогое равенство, так как ниже в коде if(oldFiber)
    // может стать undefined, так как мы обходим связанный список oldFiber
    while (index < elements.length || oldFiber != null) {
        const element = elements[index];
        let newFiber = null;
        // подумать о лучшем название sameType
        const sameType = oldFiber &&
            element &&
            oldFiber.type === element.type;
        // обновляем пропсы
        if (sameType) {
            newFiber = {
                type: oldFiber ? oldFiber.type : null,
                props: element.props,
                node: oldFiber ? oldFiber.node : null,
                parent: workingFiber,
                alternate: oldFiber,
                action: "UPDATE" // лучше использовать как в react effectTag
            };
        }
        // добавляем новый узел
        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                node: null,
                parent: workingFiber,
                alternate: null,
                action: "ADD",
            };
        }
        // удаляем узел
        if (oldFiber && !sameType) {
            oldFiber.action = "REMOVE",
                React.nodesToRemove.push(oldFiber);
        }
        // не забываем двигаться по связанному списку oldFiber sibling
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
        if (index === 0) {
            workingFiber.child = newFiber;
        } else if (element && prevSibling ) {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        index += 1;
    }
}
