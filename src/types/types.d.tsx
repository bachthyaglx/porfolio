// Define the type for the global state
export interface GlobalState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  exitMenu: () => void;
  isModalOpen: boolean;
  toggleModal: () => void;
  exitModal: () => void;
}

export interface ServiceData {
  hl: string;
  desc: string;
  img: string;
}