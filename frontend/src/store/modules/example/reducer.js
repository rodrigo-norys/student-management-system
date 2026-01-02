import * as types from '../types';

const initialState = {
  clickedButton: false
};

export default function exampleReducer(state = initialState, action) {
  if (action.type === types.CLICKED_BUTTON_SUCCESS) {
    const newState = { ...state };
    newState.clickedButton = !newState.clickedButton;
    return newState;
  } else if (action.type === types.CLICKED_BUTTON_FAILURE) {
    console.log('Error =(');
    return state;
  } else if (action.type === types.CLICKED_BUTTON_REQUEST) {
    console.log('Making the request!');
    return state;
  } else {
    return state;
  }
}
