interface ModalButtonsProps {
  onCancel: () => void;
  isSubmitDisabled: boolean;
  submitText: string;
}

export const ModalButtons: React.FC<ModalButtonsProps> = ({
  onCancel,
  isSubmitDisabled,
  submitText,
}) => (
  <div className="flex justify-end gap-3 pt-4 border-t">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
        isSubmitDisabled
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
      disabled={isSubmitDisabled}
    >
      {submitText}
    </button>
  </div>
);
