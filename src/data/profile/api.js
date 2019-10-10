import { fetchApi } from '../../services/api';

const endPoints = {
	get: '/in/settings/my-profile',
	updateprofile: '/in/settings/update-profile',
};

export const get = payload => fetchApi(endPoints.get, payload, 'get');
export const updateProfile = payload => fetchApi(endPoints.updateprofile, payload, 'post');
