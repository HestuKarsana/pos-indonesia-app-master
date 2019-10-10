import { fetchApi } from '../../services/api';

const endPoints = {
	get: '/in/legacy/check-point',
};

export const get = payload => fetchApi(endPoints.get, payload, 'get');