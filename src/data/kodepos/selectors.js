import store from '../../store';

export const get = () => {
	const { items } = store.getState().data.kodepos;
	const itemsArray = Object.keys(items).map(itemKey => items[itemKey]);
	itemsArray.sort((item1, item2) => item1.posCode > item2.posCode);
	return itemsArray;
};
