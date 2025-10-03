import { useState } from "react";

interface UseModalStateReturn<T> {
  selectedItem: T | null;
  isOpen: boolean;
  openModal: (item: T) => void;
  closeModal: () => void;
}

/**
 * Reusable hook for managing modal state with selected item
 * Generic type T allows this to work with any item type (Testimonial, Founder, etc.)
 */
export function useModalState<T>(): UseModalStateReturn<T> {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (item: T) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Delay clearing the item to allow exit animation
    setTimeout(() => setSelectedItem(null), 300);
  };

  return {
    selectedItem,
    isOpen,
    openModal,
    closeModal,
  };
}
