import "./Button.css";

export  default function Button({
  label,
  onClick,
  disabled,
  type,
  className,
  children,
  width = 190,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  type: "button" | "submit" | "reset";
  className: string;
  children?: React.ReactNode;
  width?: number | string;
}) {
  return (
    <button
      style={{
        width: width,
      }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`app-button ${className}`.trim()}
    >
      <div>
        {label}
        {children}
      </div>
    </button>
  );
}
