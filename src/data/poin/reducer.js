import * as actionTypes from './actionTypes';

const initialState = {};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.UPDATE:
			return {
				...action.poin,
			};				
		default:
			return state;
	}
};
