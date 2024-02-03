import create from 'zustand';

const useModalStore = create((set) => ({
  modal: false,
  setModal: () => set({ modal: true }),
  closeModal: () => set({ modal: false }),
}));

export default useModalStore;