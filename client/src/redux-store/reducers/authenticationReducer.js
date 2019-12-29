import Types from '../Types'

const initStore = {
    token: localStorage.getItem("token") || null,
    user: null
}

const authenticationReducer = (store = initStore, action) => {
    switch (action.type) {
        case Types.LOGIN: return {
            ...store,
            token: action.payload.token,
            user: action.payload.user
        }

        case Types.LOGOUT:
            localStorage.removeItem("token")
            return {
                ...store,
                token: null,
                user: null
            }

        case Types.LOAD_USER: return {
            ...store,
            token: action.payload.token,
            user: action.payload.user
        }

        default: return store
    }
}

export default authenticationReducer