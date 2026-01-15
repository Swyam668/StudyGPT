import React from "react";

const Button = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    className = "",
    variant = "primary",
    size = "md",
}) => {
    const baseStyles = ''

    const variantStyles = {
        primary: '',
        secondary: '',
        outline: ''
    };

    const sizeStyles = {
        sm: '',
        md: '',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={[
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                ].join(' ')}
        >
            {children}
        </button>
    );
};



export default Button;