import React from 'react';

export const Button = React.forwardRef(
  ({ type = 'button', children, className = '', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
