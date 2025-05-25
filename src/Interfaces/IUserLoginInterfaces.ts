import { ProfilePicture } from "./IPRofile";

export interface IUser {
 id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
     firstname?: string;  
    lastname?: string;
    [key: string]: unknown;
}

export interface IRole {
    id: number;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
  
export interface IUserWithRole extends IUser {
  role: IRole;
}


export interface IUserWithPic extends IUser {
  profilePic?: ProfilePicture;
}

export interface ILoginSuccessResponse {
  jwt: ILoginToken;
  user: IUser;
}
export interface ILoginErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

export interface ILoginEmail {
  identifier: string;
}
export interface ILoginToken {
  auth_token: string;
}

export interface ILoginForm {
  identifier: ILoginEmail;
  password: string;
}   

export interface IRegisterData {
  username: string;
  email: string;
  password: string;
}
export interface StrapiErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

export interface IUseAuthApiResult {
  login: (data: ILoginForm, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: Error | null;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  rememberedEmail: string | null;
}

export interface IAuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  token: ILoginToken | null;
  login: (token: ILoginToken, user: IUser) => Promise<void>;
  logout: () => void;
  setUser: (user: IUser | null) => void;
  setIsLoading: (loading: boolean) => void;
}

