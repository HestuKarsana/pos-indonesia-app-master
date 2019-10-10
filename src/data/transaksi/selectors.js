import store from '../../store';

export const get = () => {
	const { items } = store.getState().data.transaksi;
	const itemsArray = Object.keys(items).map(itemKey => items[itemKey]);
	itemsArray.sort((item1, item2) => item1.idTransaksiIpos > item2.idTransaksiIpos);
	return itemsArray;
};
