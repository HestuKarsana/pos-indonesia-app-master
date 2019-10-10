import store from '../../store';

export const getPengumuman = () => {
	const { items } = store.getState().data.pengumuman;
	const itemsArray = Object.keys(items).map(itemKey => items[itemKey]);
	itemsArray.sort((item2, item1) => item1.campaignID > item2.campaignID);
	return itemsArray;
};
