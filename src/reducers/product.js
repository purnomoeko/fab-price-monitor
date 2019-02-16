import uuid from 'uuid';

const DEFAULT_STATE = {
    userId: null,
};


const fnList = {
    REFRESH_UUID: state => ({
        ...state,
        userId: uuid(),
    }),
};

export default (state = DEFAULT_STATE, { type, payload }) => {
    const fn = fnList[type];
    if (typeof fn === 'function') {
        return fn(state, payload);
    }
    return state;
};
