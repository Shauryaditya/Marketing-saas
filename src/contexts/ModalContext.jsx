// ModalContext.js
import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isCustomRepeatModalOpen, setIsCustomRepeatModalOpen] = useState(false);
  const openCustomRepeatModal = () => setIsCustomRepeatModalOpen(true);
  const closeCustomRepeatModal = () => setIsCustomRepeatModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isCustomRepeatModalOpen,
        openCustomRepeatModal,
        closeCustomRepeatModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
