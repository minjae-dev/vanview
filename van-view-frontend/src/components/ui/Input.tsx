import clsx from 'clsx';
import { forwardRef, InputHTMLAttributes } from 'react';

type InputProps = {
  label: string;
  name?: string;
  type?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, type = "text", error, className, ...props }, ref) => {
  return (
    <div className={clsx("flex flex-col space-y-1", className)}>
      <label htmlFor={props.id} className="text-sm font-medium">
        {label}
      </label>
      <input  
        ref={ref}  
        id={name} 
        name={name}
        type={type} 
        className={clsx(
          "px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          error ? "border-red-500" : "border-gray-300",
        )}
        {...props}     
      />  
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input; 