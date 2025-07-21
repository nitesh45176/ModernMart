const BackButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        group flex items-center px-4 py-2 
        bg-gradient-to-r from-emerald-500 to-teal-500
        hover:from-emerald-600 hover:to-teal-600
        text-white font-medium rounded-lg
        shadow-md hover:shadow-lg
        transition-all duration-300
        border border-emerald-400/20
      "
    >
      <svg
        className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </button>
  );
};
export default BackButton