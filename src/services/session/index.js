import store from '../../store';

import * as api from './api';
import * as selectors from './selectors';
import * as actionCreators from './actions';
import initialState from './reducer';

import apiConfig from '../api/config';

const SESSION_TIMEOUT_THRESHOLD = 300; // Will refresh the access token 5 minutes before it expires

let sessionTimeout = null;

const setSessionTimeout = (duration) => {
	clearTimeout(sessionTimeout);
	console.log('sessionTimeout:', duration);
	sessionTimeout = setTimeout(
		refreshToken, // eslint-disable-line no-use-before-define
		(duration - SESSION_TIMEOUT_THRESHOLD) * 10000
		
	);
};

const clearSession = () => {
	clearTimeout(sessionTimeout);
	store.dispatch(actionCreators.update(initialState));
};

const clearStore = () => {	
	//---> Clear all data store		
	store.dispatch(actionCreators.logout());			
}

const onRequestSuccess = (response) => {
	console.log('balasan:',response);
	// const tokens = response.tokens.reduce((prev, item) => ({
	// 	...prev,
	// 	[item.type]: item,
	// }), {});
	// store.dispatch(actionCreators.update({ tokens, user: response.user }));
	store.dispatch(actionCreators.update({ user: response.user }));
	// const session = selectors.get();
	// // setSessionTimeout(tokens.access.expiresIn);
	setSessionTimeout(3600);  // 1 Hour 3600 second
	return response
};

const onRequestFailed = (exception) => {
	console.log('exception:',exception);
	clearSession();
	throw exception;
};

export const refreshToken = () => {
	const session = selectors.get();
	console.log('session:',session);
	console.log('refreshToken now ..');
	const accessToken = (session.user) ? session.user.token : '';	

	if(accessToken){
		return api.refresh(session.user.token)
		.then(onRequestSuccess)
		.catch(onRequestFailed);
	}
	// if (!session.tokens.refresh.value || !session.user.id) {
	// if (session.user.token === null || !session.user.token || !session.user.idPendaftaran) {
	// 	return Promise.reject();
	// }
	// return api.refresh(apiConfig.USERNAME, apiConfig.PASSWORD)
	// return api.refresh(session.user.token)
	// .then(onRequestSuccess)
	// .catch(onRequestFailed);
};

export const authenticate = (username, password) =>
	api.authenticate(username, password)
	.then(onRequestSuccess)
	.catch(onRequestFailed);

export const revoke = () => {
	// const session = selectors.get();
	// return api.revoke(Object.keys(session.tokens).map(tokenKey => ({
	// 	type: session.tokens[tokenKey].type,
	// 	value: session.tokens[tokenKey].value,
	// })))
	// .then(clearSession())
	// .catch(() => {});
	clearSession();
	clearStore();
};

const onRequestSuccessTnT = (response) => {
	console.log('balasanTnT:',response);
	// const tokens = response.tokens.reduce((prev, item) => ({
	// 	...prev,
	// 	[item.type]: item,
	// }), {});
	// store.dispatch(actionCreators.update({ tokens, user: response.user }));
	// store.dispatch(actionCreators.update({ user: response.user }));
	// const session = selectors.get();
	// // setSessionTimeout(tokens.access.expiresIn);
	// setSessionTimeout(360);
	return response
};

export const tracetrack = (noresi) =>
	api.tracetrack(noresi)
	.then(onRequestSuccessTnT)
	.catch(onRequestFailed);
