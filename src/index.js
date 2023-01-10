import './lib/browserGlobalVar.js';
import { createElement } from './lib/ReactElement.js';
import ReactDOM from './lib/ReactDOM.js';
import { workLoop } from './lib/workLoop.js';

//hooks
import { useState } from './lib/hooks/index.js'

// начинаем рендеринг
requestIdleCallback(workLoop);

export default {
	createElement,
	useState
}

export {
	ReactDOM
}
