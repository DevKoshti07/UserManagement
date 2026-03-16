import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar: string;
    password?: string;
    isLocal?: boolean;
}

interface UsersState {
    users: User[];
    page: number;
    limit: number;
    hasMore: boolean;
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    selectedUser: User | null;
}

const initialState: UsersState = {
    users: [],
    page: 1,
    limit: 10,
    hasMore: true,
    loading: false,
    loadingMore: false,
    error: null,
    selectedUser: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setLoadingMore: (state, action: PayloadAction<boolean>) => {
            state.loadingMore = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setUsers: (state, action: PayloadAction<{ users: User[]; page: number; hasMore: boolean }>) => {
            // Preserve locally created or edited users
            const preservedUsers = state.users.filter(u => u.isLocal);
            const incomingIds = new Set(action.payload.users.map(u => u.id));
            const uniquePreserved = preservedUsers.filter(u => !incomingIds.has(u.id));

            state.users = [...uniquePreserved, ...action.payload.users];
            state.page = action.payload.page;
            state.hasMore = action.payload.hasMore;
            state.error = null;
        },
        appendUsers: (state, action: PayloadAction<{ users: User[]; page: number; hasMore: boolean }>) => {
            // Avoid duplicates
            const existingIds = new Set(state.users.map(u => u.id));
            const newUsers = action.payload.users.filter(u => !existingIds.has(u.id));
            
            if (newUsers.length === 0) {
                state.hasMore = false;
            } else {
                state.users = [...state.users, ...newUsers];
                state.page = action.payload.page;
                state.hasMore = action.payload.hasMore;
            }
            state.error = null;
        },
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },
        removeUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
            if (state.selectedUser?.id === action.payload) {
                state.selectedUser = null;
            }
        },
        upsertUser: (state, action: PayloadAction<User>) => {
            const idx = state.users.findIndex(u => u.id === action.payload.id);
            if (idx !== -1) {
                state.users[idx] = action.payload;
            } else {
                state.users = [action.payload, ...state.users];
            }
            state.selectedUser = action.payload;
        },
    },
});

export const {
    setLoading,
    setLoadingMore,
    setError,
    setUsers,
    appendUsers,
    setSelectedUser,
    removeUser,
    upsertUser,
} = usersSlice.actions;

export default usersSlice.reducer;
