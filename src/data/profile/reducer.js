import * as actionTypes from './actionTypes';

const initialState = {
		token: null,
		expiresIn: null,
		fullName: null,
		firstName: null,
		lastName: null,
		email: null,
		noHP: null,
		timezone: null,
		office: null,
		userLevel: null,
		activationStatus: null,
		language: null,
		registeredDate: null,
		currentStatus: null,
		userType: null,
		idPendaftaran: null
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.UPDATE:
			return {
				...action.profile,
			};				
		default:
			return state;
	}
};

