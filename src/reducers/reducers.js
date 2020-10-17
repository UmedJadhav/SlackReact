import * as actionTypes from '../actions/types';
import { combineReducers } from 'redux';

const initialUserState = {
    currentUser: undefined,
    isLoading: true
};

const initialChannelState = {
    currentChannel: undefined,
    isPrivateChannel: false
}

const user_reducer = (state = initialUserState, action ) => {
    switch(action.type){
        case actionTypes.SET_USER:
            return {
                ...state,
                currentUser: action.payload.currentUser,
                isLoading: false
            };
        case actionTypes.CLEAR_USER:
            return{
                ...state,
                isLoading: false
            }
        default: 
        return state;
    }
}



const channel_reducer = (state = initialChannelState, action ) => {
    switch(action.type){
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        
        case actionTypes.SET_PRIVATE_CHANNEL:
            return{
                ...state,
                isPrivateChannel: action.payload.isPrivateChannel
            }
        
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    user: user_reducer,
    channels: channel_reducer
});

export default rootReducer;