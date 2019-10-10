import { NavigationActions } from 'react-navigation';
import AppNavigator from './AppNavigator';

const initialState = AppNavigator.router.getStateForAction(NavigationActions.init());

export const reducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state)
  return nextState || state
}