// src/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';

export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { token: string; refreshToken?: string; user: any; }

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<any, any>({
      query: (data) => ({
        url: '/v1/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    getProfile: builder.query<any, void>({
      query: () => ({ url: '/v1/auth/profile' }),
      providesTags: ['Auth'],
    }),
    changePassword: builder.mutation<any, { currentPassword: string; newPassword: string }>(
      {
        query: (body) => ({ url: '/v1/auth/change-password', method: 'POST', body }),
      }
    ),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/v1/auth/logout', method: 'POST' }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery, useChangePasswordMutation, useLogoutMutation } = authApi;
