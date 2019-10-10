import { fetchApi } from '../../services/api';

const endPoints = {
	get: '/in/history/transaction',
	getdetail: '/in/history/transaction/detail',
};

export const get = payload => fetchApi(endPoints.get, payload, 'get');
export const getDetail = (idTransaksiIpos)=> fetchApi(endPoints.getdetail+'/'+ idTransaksiIpos, {}, 'get');