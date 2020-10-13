import * as actionTypes from '../actions/types';
import { combineReducers } from 'redux';

const initialUserState = {
    currentUser: undefined,
    isLoading: true
};

const user_reducer = (state = initialUserState, action ) => {
    switch(action.type){
        case actionTypes.SET_USER:
            return {
                ...state,
                currentUser: action.payload.currentUser,
                isLoading: false
            };
        default: 
        return state;
    }
}

const rootReducer = combineReducers({
    user: user_reducer
});

export default rootReducer;