import { isFunctionComponent } from "../utils/simpleHelpers.js";
import { updateFunctionComponent, updateHostComponent, updateNode } from "./FiberEffectTag.js";
export function workLoop(deadline) {
    while (React.nextUnitOfWork && deadline.timeRemaining() >= 0) {
        React.nextUnitOfWork = performUnitOfWork(React.nextUnitOfWork);
    }
    if (!React.nextUnitOfWork && React.workingRoot) {
        requestAnimationFrame(commitRoot);
    }
    requestIdleCallback(workLoop);
}
// выполняем работу по добавлению node узла в dom и возращаем next работу, если
// если есть child, то его, если нет, то sibling, либо идем к parent
function performUnitOfWork(fiber) {
    if (isFunctionComponent(fiber)) {
        updateFunctionComponent(fiber);
    }
    else {
        updateHostComponent(fiber);
    }
    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    // если нет children, то будем искать sibling, если нет и его
    // то идем вверх к parent, до тех пор, пока nextFiber не станет undefined
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}

// Функция вызывается когда у нас больше нет работы по готовке fiber элементов
// далее функция commitWork вставит все эти узлы взависимости от их отношений
function commitRoot() {
    React.nodesToRemove.forEach(commitWork);
    commitWork(React.workingRoot.child);
    React.currentRoot = React.workingRoot;
    React.workingRoot = null;
}
// Рекурсивно комитим готовые наши узлы в друг друга
// fiber.parent.appendChild(fiber.node);
function commitWork(fiber) {
    if (!fiber) {
        return;
    }
    let parentFiber = fiber.parent;
    // проверяем на компонент, так как у него нет node узла, а нам
    // нужен node узел для вставки следующего узла
    while (!parentFiber.node) {
        parentFiber = parentFiber.parent;
    }
    const parentNode = parentFiber.node;
    if (fiber.action === 'ADD' && fiber.node != null && parentNode) {
        parentNode.appendChild(fiber.node);
    }
    else if (fiber.action === 'UPDATE' && fiber.node != null && fiber.alternate) {
        updateNode(fiber.node, fiber.alternate.props, fiber.props);
    }
    else if (fiber.action === 'REMOVE' && parentNode) {
        commitRemove(parentNode, fiber); //todo подумать чтобы ниже было return
		return;
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}
// при удалении узла мы двигаемся вниз, пока не найден потомка с узлом.
function commitRemove(parentFiber, fiber) {
    if (fiber && fiber.node) {
		parentFiber.removeChild(fiber.node);
	} else if (fiber && fiber.child) {
		commitRemove(parentFiber, fiber.child);
	}
}
