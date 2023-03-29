import { getCookie, setCookie } from "cookies-next";
import { NextApiResponse } from "next";
import cookie from "cookie";

export enum ServiceEnum {
  APP = "app",
  EXPLANATIONS = "explanations",
  ANALYTICS = "analytics",
}

export const SESSION_COOKIE = "judie_sid";

const isClient = () => {
  return typeof window !== "undefined";
};

const getApiUri = () => {
  return "http://localhost:8080";
};

export interface BaseFetchOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: { [key: string]: string };
  body?: any;
  access_token?: string;
  res?: NextApiResponse;
  service?: ServiceEnum;
}

export class HTTPResponseError extends Error {
  response?: any;
  constructor(response: any, status: number, ...args: any[]) {
    super(
      response.statusText || response?.error?.message,
      // @ts-ignore
      ...args
    );
    this.response = {
      ...response,
      code: Number(status),
    };
  }
}

const checkStatus = async (response: Response) => {
  if (response.ok ?? false) {
    // response.status >= 200 && response.status < 300
    return response;
  } else {
    const responseBody = await response.json();
    if (responseBody && response?.status) {
      throw new HTTPResponseError(responseBody, response.status || 500);
    } else {
      throw new HTTPResponseError({ error: true }, 500);
    }
  }
};

const checkForCookies = (response: Response) => {
  if (isClient()) {
    const cookieHeader = response.headers.get("Set-Cookie");
    const cookieContent = cookie.parse(cookieHeader || "");
    if (cookieContent) {
      setCookie(SESSION_COOKIE, cookieContent.judie_sid);
    }
    return;
  } else {
    return;
  }
};

export async function baseFetch({
  url,
  method,
  body,
  headers,
}: BaseFetchOptions): Promise<any> {
  const apiUri = getApiUri();
  // Will resolve on client side
  try {
    const reqHeaders: any = {
      "Content-Type": "application/json",
      ...headers,
    };
    const sessionCookie = getCookie(SESSION_COOKIE);
    if (sessionCookie) {
      reqHeaders.Cookie = `judie_sid=${sessionCookie};`;
    }
    const response = await fetch(`${apiUri}${url}`, {
      headers: reqHeaders,
      credentials: "include",
      method,
      body: body ? JSON.stringify(body) : null,
    });
    // console.log(response);
    await checkStatus(response);
    // checkForCookies(response);
    return response.json();
  } catch (err: any) {
    throw err;
  }
}
