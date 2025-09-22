import { create } from "zustand";

const useSearchStore = create((set) => ({
  deskTopSearchTerm: "",
  setDeskTopSearchTerm: (term) => set({ deskTopSearchTerm: term }),
}));

export default useSearchStore;
