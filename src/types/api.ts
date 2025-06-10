export interface RegisterCodeSuccess {
  data: {
    login_code: string;
  };
}

export interface RegisterEmailRequest {
  email: string;
  lang: string;
}

export interface LoginEmailRequest {
  email: string;
  pincode: number;
}

export interface LoginCodeRequest {
  login_code: string;
}

export interface GoogleRequest {
  code: string;
  redirect_uri: string;
}

export interface SessionSuccess {
  data: {
    session: string;
  };
}

export interface EmptyData {
  data: [];
}

export interface ValidationError {
  error: {
    code: string;
    message: string;
    details: { field: string; message: string }[];
  };
}

export interface WrongPinError {
  error: {
    code: string;
    message: string;
  };
}

export interface AuthError {
  error: {
    code: string;
    message: string;
  };
}
