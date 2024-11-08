import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest } from "./endpoints";

export const login = createAsyncThunk(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await loginRequest(payload);
            const access_token = res.data.access_token;
            const user_permissions = res.data.user_permissions;
            const task_module = res.data.task_module;
            return {access_token,user_permissions,task_module};
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
);