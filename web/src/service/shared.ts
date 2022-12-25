import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

export const SharedBaseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' });