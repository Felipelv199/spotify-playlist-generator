import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';

// eslint-disable-next-line import/prefer-default-export
export const store = createStore(reducers, {}, applyMiddleware(thunk));
