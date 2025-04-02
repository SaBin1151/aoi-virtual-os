export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-sm"
    >
      {children}
    </button>
  );
}
