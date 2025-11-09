"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";

const DeleteConfirmModal = forwardRef(({ onConfirm }, ref) => {
  const dialogRef = useRef();

  // Expose open() and close() methods to parent via ref
  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current.showModal(),
    close: () => dialogRef.current.close(),
  }));

  const close = () => dialogRef.current.close();

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 backdrop:backdrop-blur-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm p-6 bg-white shadow-lg dark:bg-neutral-800"
    >
      <h2 className="text-lg text-neutral-800 dark:text-neutral-100 font-semibold mb-2">Delete Task?</h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
        This action cannot be undone.
      </p>

      <div className="flex justify-between gap-3">
        <button
          onClick={close}
          className="px-3 py-1 rounded-md border border-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-100"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            close();
          }}
          className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </dialog>
  );
});

export default DeleteConfirmModal;