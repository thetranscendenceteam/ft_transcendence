import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label className="input-label">{label}</label>}
        <input
          ref={ref}
          {...props}
          className="input-field"
        />
        <style jsx>{`
          .input-wrapper {
            margin-bottom: 1rem;
          }
          .input-label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 1rem;
            color: #333;
          }
          .input-field {
            flex: 1;
            height: 40px;
            width: 100%;
            border-radius: 4px;
            border: 1px solid #ccc;
            padding: 0.5rem;
            font-size: 1rem;
            color: #333;
          }
          .input-field:disabled {
            background-color: #eaeaea;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };