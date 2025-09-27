export function Button({ children, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold p-3 rounded-xl transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
}
