import store from '../../store';

export const get = () => {
	const { items } = store.getState().data.cektarif;
	const itemsArray = Object.keys(items).map(itemKey => items[itemKey]);
	itemsArray.sort((item1, item2) => item1.serviceCode > item2.serviceCode);
	return itemsArray;
};
