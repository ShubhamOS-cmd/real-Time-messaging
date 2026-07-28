import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        setUser : (state , action) => {
            state.user = action.payload,
            state.isAuthenticated = true
        },
        clearUser : (state) => {
            state.user = null
            state.isAuthenticated = false
        }
    }
})

export const {setUser , clearUser} = authSlice.actions
export default authSlice.reducer

/**
 *  useDispatch is a React hook - hooks can only called inside React components 
 * this directly access the redux store instance works anywhere in your app not just components store.dispatch(clearUser())
 * why we can;t just use store.dispatch() everywhere andskip useDisptach()
 * we Can do this use store.dispatch() everywhere
 * the reasons we use useDispatch in react applications 
 * 1. TightCoupling 
 * when we import store directly in a component our componenet is tightly coupled to that specific store instance which 
 */