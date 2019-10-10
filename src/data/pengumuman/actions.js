// import * as api from './api';
import * as actionTypes from './actionTypes';

export const update = items => ({
	type: actionTypes.UPDATE,
	items,
});

// export const get = payload =>
// 	dispatch =>
// 		api.get(payload)
// 		.then(response => dispatch(update(response.data)));
