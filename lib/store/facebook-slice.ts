import { StateCreator } from 'zustand';

export type FacebookState = {
  currentFacebookPageId: string | null;
  setCurrentFacebookPageId: (pageId: string | null) => void;
};

// eslint-disable-next-line
const createFacebookSlice: StateCreator<FacebookState> = (set, get) => ({
  currentFacebookPageId: null,
  setCurrentFacebookPageId: (pageId) =>
    set({ currentFacebookPageId: pageId }),
});

export default createFacebookSlice;
