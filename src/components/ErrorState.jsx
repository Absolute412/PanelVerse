function ErrorState({ message, onRetry, loading }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4">
      <p className="text-center text-red-500">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          disabled={loading}
          className="
            px-4 py-2 bg-blue-500 hover:bg-blue-600
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white rounded-md
          "
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;