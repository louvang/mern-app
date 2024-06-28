import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

interface CurrentUserResponse {
  user: {
    username: string;
  };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/auth/' }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userInfo) => ({
        url: 'register',
        method: 'POST',
        body: userInfo,
      }),
    }),
    currentUser: builder.query<CurrentUserResponse, void>({
      query: () => ({
        url: 'current-user',
        method: 'GET',
        credentials: 'include', // include cookies in the request
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useCurrentUserQuery } =
  authApi;
