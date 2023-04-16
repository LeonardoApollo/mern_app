import { configureStore } from '@reduxjs/toolkit';
import { postsReucer } from './slices/posts';

const store = configureStore({
    reducer: {
        posts: postsReucer,
    }
});

export default store;