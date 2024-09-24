import { LoginResponse, Methods, NextCloudConfig, RequestParams } from ".";
import axios, { AxiosError } from "axios";
import { getConfig } from "../../utils/config";
import { getBasicToken } from "../../utils/token";

const { NEXTCLOUD_PASSWORD, NEXTCLOUD_USERNAME } = getConfig();

const methodPicker = (method: Methods) => {
  switch (method) {
    case Methods.GET:
      return axios.get;
    case Methods.POST:
      return axios.post;
    case Methods.PUT:
      return axios.put;
    case Methods.DELETE:
      return axios.delete;
    default:
      return axios.get;
  }
};

export class NextCloudClient {
  private token: string;
  constructor(private config: NextCloudConfig) {
    this.config = config;
    this.token = getBasicToken({
      username: config.username,
      password: config.password,
    });
  }

  private async requestNextCloud<T>({
    endpoint,
    data,
    headers,
    params,
    method,
  }: RequestParams): Promise<{ data: T; status: number }> {
    let response;
    try {
      response = await methodPicker(method)(
        `${this.config.baseUrl}${endpoint}`,
        data,
        {
          headers: {
            Authorization: this.token,
            ...headers,
          },
          params,
        }
      );
    } catch (error: any) {
      if (error.response) {
        response = error.response.data;
      } else {
        throw error;
      }
    }
    if (response.status >= 400) {
      throw new Error(
        `Error ${response.status}: ${response.statusText}\n${JSON.stringify(
          response.data,
          null,
          2
        )}`
      );
    }

    return { data: response.data as T, status: response.status };
  }

  public async getToken() {
    try {
      const data = {
        username: NEXTCLOUD_USERNAME,
        password: NEXTCLOUD_PASSWORD,
      };
      const loginResponse = await this.requestNextCloud<LoginResponse>({
        method: Methods.POST,
        endpoint: "/index.php/login/v2",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return loginResponse.data.poll.token;
    } catch (error: any) {
      throw new Error(
        `Error getting token: ${error.message}. Response: \n${JSON.stringify(
          error.response.data,
          null,
          2
        )}`
      );
    }
  }

  public async uploadFile(filePath: string, fileContent: Buffer) {
    try {
      const data = await this.requestNextCloud({
        method: Methods.PUT,
        endpoint: `/remote.php/dav/files/${NEXTCLOUD_USERNAME}/Documents/${filePath}`,
        data: fileContent,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.status === 201) {
        return true;
      }
    } catch (error: any) {
      throw new Error(
        `Error getting token: ${error.message}. Response: \n${JSON.stringify(
          error.response.data,
          null,
          2
        )}`
      );
    }
  }
}
