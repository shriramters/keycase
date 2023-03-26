interface ButtonProps {
  children?: React.ReactNode
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

const Button = ({ children, type, onClick }: ButtonProps) => {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      style={{
        backgroundColor: "teal",
        color: "white",
        outlineColor: "transparent",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        width: "fit-content",
        padding: "0.5rem 1rem",
        height: "fit-content"
      }}>
      {children}
    </button>
  )
}

export default Button
