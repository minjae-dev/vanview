import { LoginInput, RegisterInput } from "./type";

export const registerUser = async (data: RegisterInput) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 포함하도록 설정
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    return response;
  }

  return response.json();
};

export const loginUser = async (data: LoginInput) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 포함하도록 설정
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    return response;
  }

  return response.json();
};

export const logout = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 포함하도록 설정
    }
  );
  return response.json();
};

export const getBusinesses = async (limit: number, offset: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_OPEN_DATA_URL}?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
    }
  );
  return response.json();
};
