import { http, HttpResponse } from 'msw';

const API = '/v1';

export const handlers = [
  http.post(`${API}/user/register/code`, async () => {
    const login_code = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
    return HttpResponse.json({ data: { login_code } }, { status: 200 });
  }),

  http.post(`${API}/user/register/email`, async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return HttpResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email address format is incorrect',
            details: [
              { field: 'email', message: 'Email address format is incorrect' },
            ],
          },
        },
        { status: 422 },
      );
    }
    return HttpResponse.json({ data: [] }, { status: 200 });
  }),

  http.post(`${API}/auth/login/email`, async ({ request }) => {
    const { email, pincode } = (await request.json()) as {
      email: string;
      pincode: number;
    };
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return HttpResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email address format is incorrect',
            details: [
              { field: 'email', message: 'Email address format is incorrect' },
            ],
          },
        },
        { status: 422 },
      );
    }
    if (String(pincode) !== '123456') {
      return HttpResponse.json(
        {
          error: {
            code: 'WRONG_PIN_CODE',
            message: 'PIN code expired or missing',
          },
        },
        { status: 401 },
      );
    }
    return HttpResponse.json(
      {
        data: {
          session:
            '978fc50daaa25cf0206f678a5843b06d43fc0cab8e565b9a65cf77e3ee448784',
        },
      },
      { status: 200 },
    );
  }),

  http.post(`${API}/auth/login/code`, async ({ request }) => {
    const { login_code } = (await request.json()) as { login_code: string };
    if (!/^\d{16}$/.test(login_code)) {
      return HttpResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Login code must be 16 digits',
            details: [
              { field: 'login_code', message: 'Login code must be 16 digits' },
            ],
          },
        },
        { status: 422 },
      );
    }
    return HttpResponse.json(
      {
        data: {
          session:
            '978fc50daaa25cf0206f678a5843b06d43fc0cab8e565b9a65cf77e3ee448784',
        },
      },
      { status: 200 },
    );
  }),

  http.post(`${API}/user/register/google_account`, async ({ request }) => {
    const { code, redirect_uri } = (await request.json()) as {
      code: string;
      redirect_uri: string;
    };
    if (!code || !redirect_uri) {
      return HttpResponse.json(
        {
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Authentication error',
          },
        },
        { status: 401 },
      );
    }
    return HttpResponse.json(
      {
        data: {
          session:
            '978fc50daaa25cf0206f678a5843b06d43fc0cab8e565b9a65cf77e3ee448784',
        },
      },
      { status: 200 },
    );
  }),
];
