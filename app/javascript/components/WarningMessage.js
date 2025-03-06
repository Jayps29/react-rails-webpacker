import React from "react";
import PropTypes from "prop-types";

const WarningMessage = ({ message, onConfirm, onCancel }) => {
  if (!message) return null;

  return (
    <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 border border-yellow-400 rounded-md">
      <p>{message}</p>
      <div className="mt-2 flex gap-2">
        <button 
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Confirm
        </button>
        <button 
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

WarningMessage.propTypes = {
  message: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

export default WarningMessage;
