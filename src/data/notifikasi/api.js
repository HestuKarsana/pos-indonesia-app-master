import { fetchApi } from '../../services/api';

const endPoints = {
	get: '/in/history/notification',
};

export const get = payload => fetchApi(endPoints.get, payload, 'get');