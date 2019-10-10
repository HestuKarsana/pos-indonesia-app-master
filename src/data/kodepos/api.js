import { fetchApi } from '../../services/api';

const endPoints = {
	kodepos: '/in/sandbox/1/kode-pos',
};

export const kodepos = payload => fetchApi(endPoints.kodepos, payload, 'post');
