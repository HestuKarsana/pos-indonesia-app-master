import store from '../../store';

export const getProfile = () => store.getState().data.user;