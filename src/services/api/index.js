/* global fetch */

import fetchival from 'fetchival';
import _ from 'lodash';

import * as sessionSelectors from '../session/selectors';
import apiConfig from './config';

export const exceptionExtractError = (exception) => {
	if (!exception.errors) return false;
	let error = '';
	const errorKeys = Object.keys(exception.errors);
	// if (errorKeys.length > 0) {
	// 	error = exception.Errors[errorKeys[0]][0].message;
	// }
	Object.keys(exception.errors)
  		.forEach(function eachKey(key) { 
			const errorString = (Array.isArray(exception.errors[key]) ? exception.errors[key][0] : exception.errors[key])
    		if (errorKeys.length === 1) {   // check if only 1 object return  
				error = `${key} : ${errorString}` 
		 	}else{
				error += `${key} : ${errorString}\n` 
		 	}
 		});
	return error;
};

export const fetchApi = (endPoint, payload = {}, method = 'get', headers = {}) => {
	
	const session = sessionSelectors.get();
	const accessToken = (session.user) ? session.user.token : '';
	// if (!session.tokens.refresh.value || !session.user.id) {
	return fetchival(`${apiConfig.SERVER_URL}${apiConfig.POS_API}${endPoint}`, {
		headers: _.pickBy({
			...(accessToken ? {
				Authorization: `Token ${accessToken}`, 
			} : {
				// 'Client-ID': apiConfig.clientId,
			}),
			...headers,
		}, item => !_.isEmpty(item)),
	})[method.toLowerCase()](payload)
	.catch((e) => {		
		console.log('errprdifecthAPI',e.response);
		if (e.response && e.response.json) {
			e.response.json().then((json) => {
				if (json) throw json;
				throw e;
			});
		} else {
			throw e;
		}
	});
};
