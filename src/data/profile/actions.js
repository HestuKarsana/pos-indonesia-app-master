import * as api from './api';
import * as actionTypes from './actionTypes';

const update = profile => ({
	type: actionTypes.UPDATE,
	profile,
});

export const get = payload =>
	dispatch =>
		api.get(payload)
		.then(response => dispatch(update(response)));
