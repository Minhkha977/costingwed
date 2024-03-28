import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DomainApi from '~/DomainApi';
import { fetchPeriod, fetchApiToken } from '../FetchApi/fetchApiMaster';

const initialState = {
    listData_Period: [],
    token: '',
    isLoading: false,
    isError: false,
};

export const period = createSlice({
    name: 'period',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder
            .addCase(fetchPeriod.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchPeriod.fulfilled, (state, action) => {
                // Add user to the state array
                state.listData_Period = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchPeriod.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
            })

            .addCase(fetchApiToken.pending, (state, action) => {
                // Add user to the state array
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchApiToken.fulfilled, (state, action) => {
                // Add user to the state array
                state.token = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchApiToken.rejected, (state, action) => {
                // Add user to the state array
                state.isLoading = false;
                state.isError = true;
            });
    },
});

export default period.reducer;
