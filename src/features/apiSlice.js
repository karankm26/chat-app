import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  groupApi,
  loginApi,
  messageApi,
  messagePostApi,
  registerApi,
  userAllApi,
  userApi,
  userUpdateApi,
} from "../api";

export const login = createAsyncThunk("api/login", async (body, thunkAPI) => {
  try {
    const response = await loginApi(body);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk(
  "api/register",
  async (body, thunkAPI) => {
    try {
      const response = await registerApi(body);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserAll = createAsyncThunk(
  "api/fetchUserAll",
  async (_, thunkAPI) => {
    try {
      const response = await userAllApi();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchGroup = createAsyncThunk(
  "api/fetchGroup",
  async (_, thunkAPI) => {
    try {
      const response = await groupApi();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "api/fetchUser",
  async (id, thunkAPI) => {
    try {
      const response = await userApi(id);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "api/updateUser",
  async (data, thunkAPI) => {
    try {
      const response = await userUpdateApi(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "api/fetchMessages",
  async (data, thunkAPI) => {
    try {
      const response = await messageApi(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const apiSlice = createSlice({
  name: "api",
  initialState: {
    login: {},
    loginLoading: false,
    loginError: null,
    loginSuccess: null,

    regsiter: {},
    regsiterLoading: false,
    regsiterError: null,
    regsiterSuccess: null,

    userAll: [],
    userAllLoading: false,
    userAllError: null,
    userAllSuccess: null,

    user: {},
    userLoading: false,
    userError: null,
    userSuccess: null,

    updateUser: {},
    updateUserLoading: false,
    updateUserError: null,
    updateUserSuccess: null,

    group: [],
    groupLoading: false,
    groupError: null,
    groupSuccess: null,

    messages: [],
    messagesLoading: false,
    messagesError: null,
    messagesSuccess: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.login = action.payload;
        state.loginSuccess = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.error.message;
      });

    builder
      .addCase(register.pending, (state) => {
        state.regsiterLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.regsiterLoading = false;
        state.regsiter = action.payload;
        state.regsiterSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.regsiterLoading = false;
        state.regsiterError = action.error.message;
      });

    builder
      .addCase(fetchUserAll.pending, (state) => {
        state.userAllLoading = true;
      })
      .addCase(fetchUserAll.fulfilled, (state, action) => {
        state.userAllLoading = false;
        state.userAll = action.payload;
        state.userAllSuccess = true;
      })
      .addCase(fetchUserAll.rejected, (state, action) => {
        state.userAllLoading = false;
        state.userAllError = action.error.message;
      });

    builder
      .addCase(fetchGroup.pending, (state) => {
        state.groupLoading = true;
      })
      .addCase(fetchGroup.fulfilled, (state, action) => {
        state.groupLoading = false;
        state.group = action.payload;
        state.groupSuccess = true;
      })
      .addCase(fetchGroup.rejected, (state, action) => {
        state.groupLoading = false;
        state.groupError = action.error.message;
      });

    builder
      .addCase(fetchUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload;
        state.userSuccess = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = action.error.message;
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.updateUserLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUserLoading = false;
        state.updateUser = action.payload;
        state.updateUserSuccess = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserLoading = false;
        state.updateUserError = action.error.message;
      });

    builder
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload;
        state.messagesSuccess = true;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.messagesError = action.error.message;
      });
  },
});

export default apiSlice.reducer;
