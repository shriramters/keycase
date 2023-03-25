interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
}

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
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
