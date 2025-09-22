import { create } from "zustand";

type AuthState = {  
  isLogin: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
};

export const authStore = create<AuthState>((set) => ({
  isLogin: false,
  setLoggedIn: (loggedIn: boolean) => set({ isLogin: loggedIn })
}));  
