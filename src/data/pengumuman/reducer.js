import * as actionTypes from './actionTypes';

const initialState = {
	items: {},
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.UPDATE:
			return {
				items: {
					...state.items,
					...action.items.reduce((prev, curr) => ({
						...prev,
						[curr.campaignID]: curr,
					}), {}),
				},
			};
		default:
			return state;
	}
};
