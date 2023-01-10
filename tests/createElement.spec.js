const React = require('../dist/index.js')

const createElement = React.default.createElement;

describe('createElement', () => {
	test('Один аргумент: type', () => {
		expect(createElement('h1'))
			.toEqual({
				type: "h1",
				props: { children: [] }
			})
	});
	test('Два аргумента и props = null: type, null, text', () => {
		expect(createElement('h1', null, 'Hello world'))
			.toEqual({
				type: "h1",
				props: {
					children: [
						'Hello world'
					]
				}
			})
	});
	test('Три аргумента: type, props, text', () => {
		expect(createElement('h1', { className: 'header__title' }, 'Hello world'))
			.toEqual({
				type: 'h1',
				props: {
					className: 'header__title',
					children: [
						'Hello world'
					]
				}
			})
	});
})
