import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DomainApi from '~/DomainApi';
import { fetchPeriod } from '../FetchApi/fetchApiMaster';

// const initialState_data = {
//     listData: [],
//     isLoading: false,
//     isError: false,
// };

// export const period = createSlice({
//     name: 'period',
//     initialState_data,
//     reducers: {},
//     extraReducers: (builder) => {
//         // Add reducers for additional action types here, and handle loading state as needed
//         builder
//             .addCase(fetchPeriod.pending, (state, action) => {
//                 // Add user to the state array
//                 state.isLoading = true;
//                 state.isError = false;
//             })
//             .addCase(fetchPeriod.fulfilled, (state, action) => {
//                 // Add user to the state array
//                 state.listData = action.payload;
//                 state.isLoading = false;
//                 state.isError = false;
//             })
//             .addCase(fetchPeriod.rejected, (state, action) => {
//                 // Add user to the state array
//                 state.isLoading = false;
//                 state.isError = true;
//             });
//     },
// });

const initialState = {
    value: 0,
    unitcode: localStorage.getItem('Unit') ? localStorage.getItem('Unit') : 'UN001',
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            console.log('action', action);
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;

// export default period.reducer;
