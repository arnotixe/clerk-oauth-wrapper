import React, { useState } from "react";
import { Field } from "formik";
import { twMerge } from "tailwind-merge";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // Import icons for toggle button

const TextField = ({
  id,
  onEnter,
  name,
  title,
  disabled,
  className,
  type = "text",
  autoFocus,
  placeholder,
  autoComplete,
  noDisplay,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const keyPressed = (ev) => {
    if (ev.key === "Enter") {
      if (onEnter) {
        onEnter();
      }
    }
  };

  return (
    <div className={twMerge("py-2", noDisplay && " hidden", className)}>
      <div className="flex flex-col gap-">
        <div className="text-xs font-medium mb-1 pl-3">{title}</div>

        <div className="relative">
          <Field
            autoFocus={autoFocus}
            onKeyDown={keyPressed}
            id={id}
            autoComplete={autoComplete}
            type={showPassword ? "text" : type}
            disabled={disabled}
            name={name}
            placeholder={placeholder}
            className={twMerge(
              "border border-gray-200 rounded-md p-4 text-xs h-[48px] w-full",
              disabled && "bg-gray-100 border-gray-300 text-gray-300",
            )}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            >
              {showPassword ? (
                <IoEyeOffOutline className="h-5 w-5" />
              ) : (
                <IoEyeOutline className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextField;
