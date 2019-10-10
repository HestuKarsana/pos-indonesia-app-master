import * as api from './api';
import * as actionTypes from './actionTypes';

const update = poin => ({
	type: actionTypes.UPDATE,
	poin,
});

export const get = payload =>
	dispatch =>
		api.get(payload)
		.then(response => dispatch(update(response)));
