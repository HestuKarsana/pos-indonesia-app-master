import { fetchApi } from '../../services/api';

const endPoints = {
	get: '/in/legacy/campaigns',
};

export const get = payload => fetchApi(endPoints.get, payload, 'get');


