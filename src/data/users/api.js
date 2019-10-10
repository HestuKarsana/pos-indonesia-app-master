import { fetchApi } from '../../services/api';

const endPoints = {
	change: '/ubah-password',
	create: '/register',
	sendVerification: '/verification/register',
	createActivation: '/register-aktivasi',
	sendVerificationForgotPassword : '/verification/forgot-password',
	updateForgotPassword : '/forgot-password',
	get: '/users',
};

export const change = payload => fetchApi(endPoints.change, payload, 'post');

export const create = payload => fetchApi(endPoints.create, payload, 'post');
export const sendVerification = payload => fetchApi(endPoints.sendVerification, payload, 'post');
export const createActivation = payload => fetchApi(endPoints.createActivation, payload, 'post');

export const sendVerificationForgotPassword = payload => fetchApi(endPoints.sendVerificationForgotPassword, payload, 'post');
export const updateForgotPassword = payload => fetchApi(endPoints.updateForgotPassword, payload, 'post');

export const get = payload => fetchApi(endPoints.get, payload, 'get');
