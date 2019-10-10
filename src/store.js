import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import { persistStore, autoRehydrate } from 'redux-persist';
import createFilter from 'redux-persist-transform-filter';

import { reducer as dataReducer } from './data/reducer';
import { reducer as servicesReducer } from './services/reducer';
import { reducer as navigationReducer } from './navigationReducer';
import * as persistActionCreators from './services/persist/actions';

const appReducer = combineReducers({
	services: servicesReducer,
	data: dataReducer,
	nav: navigationReducer
});

//--> Reset data state
const prevState = (servicesReducer, {})
const rootReducer = (state, action) => {	
	if (action.type === 'LOGOUT') {			
		  state = prevState;
	}
	return appReducer(state, action);
};

const enhancer = compose(
	applyMiddleware(
		thunk,
	),
	devTools()
);

const store = createStore(
	rootReducer,
	enhancer,
	autoRehydrate(),
);

const saveAndLoadSessionFilter = createFilter(
  'services',
  ['session'],
  ['session']
);

export const persist = persistStore(store, {
	storage: AsyncStorage,
	blacklist: ['data'],
	transforms: [saveAndLoadSessionFilter],
}, () => store.dispatch(persistActionCreators.update({ isHydrated: true })));

export default store;
