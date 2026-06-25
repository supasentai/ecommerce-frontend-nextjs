export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

export type AuthBackendResponse =
  | AuthSession
  | {
      data?: Partial<AuthSession> & {
        token?: string;
      };
      user?: AuthUser;
      accessToken?: string;
      token?: string;
      refreshToken?: string;
    };

export type RegisterBackendResponse =
  | AuthUser
  | {
      success?: boolean;
      data?: AuthUser | { user?: AuthUser };
      user?: AuthUser;
      message?: string;
    };

export type RefreshTokenPayload = {
  refreshToken: string;
};
