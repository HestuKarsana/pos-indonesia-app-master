import { fetchApi } from '../../services/api';

const endPoints = {
	getSheet: '/in/sandbox/2/get-sheet',
	getSheetHistory: '/in/history/sheet',
	createManifest: '/in/sandbox/2/create-manifest',
	addTransaction: '/in/sandbox/2/add-transaction',
	closeManifest: '/in/sandbox/2/close-manifest',
	getTransaction: '/in/history/transaction',
	getDetail: '/in/history/transaction/detail',
	getDetailDownload: '/in/pdf/pon',
};
export const getSheet = payload => fetchApi(endPoints.getSheet, payload, 'post');
export const getSheetHistory = payload => fetchApi(endPoints.getSheetHistory, payload, 'get');
export const createManifest = payload => fetchApi(endPoints.createManifest, payload, 'post');
export const addTransaction = payload => fetchApi(endPoints.addTransaction, payload, 'post');
export const closeManifest = payload => fetchApi(endPoints.closeManifest, payload, 'post');
export const getTransaction = payload => fetchApi(endPoints.getTransaction, payload, 'get');
export const getDetail = (idTransaksiIpos)=> fetchApi(endPoints.getDetail+'/'+ idTransaksiIpos, {}, 'get');
export const getDetailDownload = payload => fetchApi(endPoints.getDetailDownload, payload, 'get');
