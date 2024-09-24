export interface NextCloudConfig {
  baseUrl: string;
  username: string;
  password: string;
}

interface PollResponse {
  token: string;
  endpoint: string;
}

export interface LoginResponse {
  poll: PollResponse;
  login: string;
}

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface RequestParams {
  method: Methods;
  endpoint: string;
  data?: any;
  headers?: object;
  params?: object;
}
