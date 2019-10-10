import store from '../../store';

export const get = () => {
	const { items } = store.getState().data.riwayat;
	const itemsArray = Object.keys(items).map(itemKey => items[itemKey]);
	itemsArray.sort((item1, item2) => item1.idNotifikasi > item2.idNotifikasi);
	return itemsArray;
};
