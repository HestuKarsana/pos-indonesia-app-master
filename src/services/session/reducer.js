import * as actionTypes from './actionTypes';

export const initialState = {
	// tokens: {
	// 	access: {
	// 		type: null,
	// 		value: null,
	// 		expiresIn: null,
	// 	},
	// 	refresh: {
	// 		type: null,
	// 		value: null,
	// 	},
	// },
	// errors: {},
	user: {		
		activationStatus: null,
		currentStatus: null,
		email: null,
		firstName: null,
		fullName: null,
		idPendaftaran: null,
		language: null,
		lastName: null,
		noHP: null,
		office: null,
		registeredDate: null,
		timezone: null,
		token: null,
		userLevel: null,
		userType: null,
		username: null,
	},
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.UPDATE:
			return {
				...action.session,
			};
		default:
			return state;
	}
};
