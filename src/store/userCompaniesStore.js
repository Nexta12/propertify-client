import { create } from "zustand";

const useCompanyStore = create((set) => ({
  userCompanies: [],
  setUserCompanies: (userCompanies) => set({ userCompanies }),
}));

export default useCompanyStore;
