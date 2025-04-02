// src/components/ui/button.jsx
export function Button({ children, onClick, size = "md" }) {
  const sizeClass = size === "sm" ? "px-2 py-1 text-sm" : "px-3 py-1";
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white rounded hover:bg-blue-600 ${sizeClass}`}
    >
      {children}
    </button>
  );
}
