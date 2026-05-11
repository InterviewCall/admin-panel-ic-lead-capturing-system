import { configureStore } from '@reduxjs/toolkit';

import formBuilderReducer from '@/lib/slices/formBuilderSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            formBuilder: formBuilderReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];