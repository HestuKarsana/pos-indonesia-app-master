import { combineReducers } from 'redux';
import { reducer as usersReducer } from './users/reducer';
import { reducer as pengumumanReducer } from './pengumuman/reducer';
import { reducer as cektarifReducer } from './cektarif/reducer';
import { reducer as kodeposReducer } from './kodepos/reducer';
import { reducer as profileReducer } from './profile/reducer';
import { reducer as riwayatReducer } from './riwayat/reducer';
import { reducer as poinReducer } from './poin/reducer';
import { reducer as notifikasiReducer } from './notifikasi/reducer';
import { reducer as transaksiReducer } from './transaksi/reducer';

export const reducer = combineReducers({
	users: usersReducer,
	pengumuman: pengumumanReducer,
	cektarif: cektarifReducer,
	kodepos: kodeposReducer,
	profile: profileReducer,
	riwayat: riwayatReducer,
	poin: poinReducer,
	notifikasi: notifikasiReducer,
	transaksi: transaksiReducer,
});

export const resetReducer = combineReducers({			
	users: {},
	pengumuman: {},
	cektarif: {},
	kodepos: {},
	profile: {},
	riwayat: {},
	poin: {},
	notifikasi: {},
	transaksi: {},
})