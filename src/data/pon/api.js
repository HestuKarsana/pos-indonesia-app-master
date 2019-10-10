import { fetchApi } from '../../services/api';

const endPoints = {
	addPosting: '/in/sandbox/3/add-posting',
	getPosting: '/in/history/pon',
	getDetail: '/in/history/pon/detail',
	getDetailDownload: '/in/pdf/pon',
};

export const addPosting = payload => fetchApi(endPoints.addPosting, payload, 'post');
export const getPosting = payload => fetchApi(endPoints.getPosting, payload, 'get');
export const getDetail = (idPostingPon)=> fetchApi(endPoints.getDetail+'/'+ idPostingPon, {}, 'get');
export const getDetailDownload = payload => fetchApi(endPoints.getDetailDownload, payload, 'get');
