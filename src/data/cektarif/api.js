import { fetchApi } from '../../services/api';

const endPoints = {
	cektarif: '/in/sandbox/1/cek-tarif',
};

export const cektarif = payload => fetchApi(endPoints.cektarif, payload, 'post');
