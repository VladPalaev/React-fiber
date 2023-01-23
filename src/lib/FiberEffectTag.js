import { isEventProps, isProperty, wasAddedProps, wasRemoveProps } from "../utils/simpleHelpers.js";
import { reconcileChildren } from "./ReactFiberReconciler.js";

export function updateNode(fiberNode, prevProps, nextProps) {
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(wasRemoveProps(prevProps, nextProps))
        .forEach((key) => {
        fiberNode[key] = "";
    });

    Object.keys(nextProps)
        .filter(isProperty)
        .filter(wasAddedProps(prevProps, nextProps))
        .forEach((key) => {
        fiberNode[key] = nextProps[key];
    });

    Object.keys(prevProps)
        .filter(isEventProps)
        .filter((key) => !(key in nextProps) ||
        wasAddedProps(prevProps, nextProps)(key))
        .forEach((key) => {
        const eventType = key.toLocaleLowerCase().slice(2);

        fiberNode.removeEventListener(eventType, prevProps[key]);
    });

    Object.keys(nextProps)
        .filter(isEventProps)
        .filter(wasAddedProps(prevProps, nextProps))
        .forEach((key) => {
        const eventType = key.toLocaleLowerCase().slice(2);

        fiberNode.addEventListener(eventType, nextProps[key]);
    });
}

// Запускаем нашу функцию, чтобы получить дочерние элементы, как раз поэтому
// все компоненты должны возращать один обернутый тег или fragment
export function updateFunctionComponent(fiber) {
    React.workingFiber = fiber; // сохраняем ссылку на наш fiber из компонента
    React.hookIndex = 0;
    React.workingFiber.hooks = [];

    // так как компонент это просто функция, ниже мы ее вызываем, но мы хотим
    // иметь доступ к fiber узлу, поэтому у нас есть глобальная переменная
    // React.workingFiber, вдальнейшем из хуков, у нас будет доступ к
    // fiber узлу
    const result = fiber.type(fiber.props);
	let children = [];

	if (Array.isArray(result)) {
		children = [...result];
	} else {
		children = [result]
	}
    reconcileChildren(fiber, children);
}

// создаем в fiber node узел и так же определяем отношения в fiber-e
// child, sibling проходим стадию reconcile какие узлы обновлять, удалять и etc
export function updateHostComponent(fiber) {
    if (!fiber.node) {
        fiber.node = createNode(fiber);
    }

    reconcileChildren(fiber, fiber.props.children);
}
// создаем из fiber узла DOM узел и присваиваем все атрибуты и обработчики
function createNode(fiber) {
    const node = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type);

    const { children, ...props } = fiber.props;

    updateNode(node, {}, props);

    return node;
}

export function fragment(props) {
	return props.children;
}
