import store from '../../store';

export const get = () => {
	const { items } = store.getState().data.riwayat;
	const itemsArray = Object.keys(items).map(itemKey => items[itemKey]);
	itemsArray.sort((item1, item2) => item1.idTransaksi > item2.idTransaksi);
	return itemsArray;
};
