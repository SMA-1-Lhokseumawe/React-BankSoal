import React from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { RiNotification3Line } from 'react-icons/ri';

const Button = ({ bgColor, color, size, text, borderRadius, icon }) => {
  return (
    <button
      type="button"
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={`flex items-center test-${size} p-3 hover:drop-shadow-xl`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
