import React, { useEffect, useRef } from "react";
// @ts-ignore
import { XIcon } from "@heroicons/react/solid";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className = "" }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
      {/* CẬP NHẬT QUAN TRỌNG:
         1. w-auto, max-w-fit: Để Modal tự to ra theo Form bên trong (Form 900px thì Modal 900px).
         2. md:min-w-[500px]: Để các Modal nhỏ (confirm xóa) không bị bé quá.
         3. max-h-[95vh]: Giới hạn chiều cao tối đa không vượt quá màn hình.
      */}
      <div
        ref={modalRef}
        className={`
            bg-white rounded-lg shadow-xl overflow-hidden transform transition-all
            w-auto max-w-fit md:min-w-[500px] max-h-[95vh] flex flex-col
            ${className}
        `}
      >
        {/* Header - Giữ cố định (flex-none) để không bị co lại khi cuộn */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 flex-none">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition focus:outline-none p-1 rounded-full hover:bg-gray-200"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body - Tự động co giãn (flex-1) */}
        <div className="p-0 flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}