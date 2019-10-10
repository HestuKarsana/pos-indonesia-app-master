import * as actionTypes from './actionTypes';

export const update = session => ({
	type: actionTypes.UPDATE,
	session,
});

export const logout = () => ({
	type: actionTypes.LOGOUT,	
});