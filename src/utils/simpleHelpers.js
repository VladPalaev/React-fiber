// из fiber забираем только пропсы
export const isProperty = (key) => key !== 'children' && !isEventProps(key);

// helper для filter, нужен для того, чтобы понять какие значения
// свойства нужно обновить или какие новые ключи/значения
export const wasAddedProps = (prev, next) => (key) => prev[key] !== next[key];

// helper для filter, какие пропсы нужно удалить
export const wasRemoveProps = (prev, next) => (key) => !(key in next);

// находим среди пропсов особый тип, eventListener
export const isEventProps = (key) => key.startsWith('on');

// проверяем fiber на то что может быть компонентом, компоненты не
// имеют своего node узла, их задача вызваться и вернуть children
export function isFunctionComponent(fiber) {
	return fiber.type instanceof Function;
}
