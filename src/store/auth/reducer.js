import { createSlice } from "@reduxjs/toolkit";
import { login } from "./action";
import { jwtDecode } from "jwt-decode"; // Note: Changed from "jwt-decode" to "jwtDecode"

const token = localStorage.getItem("access_token");

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: token || null,
        currentUser: token ? jwtDecode(token) : null,
        isLoading: false,
        error: null,
        registerForm: {},
        isRegisterOpen: false,
        isSignupLoading: false,
    },
    reducers: {
        logout(state) {
            localStorage.removeItem("access_token");
            state.token = null;
            state.currentUser = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                console.log('payload', payload);
                const { access_token, user_permissions, task_module } = payload;
            
                // Ensure the access_token is valid
                if (access_token && typeof access_token === "string") {
                    localStorage.setItem("access_token", access_token);
                    localStorage.setItem("user_permissions", JSON.stringify(user_permissions));
                    localStorage.setItem("task_module", JSON.stringify(task_module));
                    state.token = access_token;
                    state.currentUser = jwtDecode(access_token); // Safe to decode now
                    state.user_permissions = user_permissions;  // Set user_permissions in the state
                    state.task_module = task_module;  // Set task_module in the state
                } else {
                    state.error = "Invalid token received";
                }
                state.isLoading = false;
            })
            
            .addCase(login.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
                state.token = null;
                localStorage.removeItem("access_token");
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
