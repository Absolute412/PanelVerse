
const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
        <div className="bg-component dark:bg-component-dark rounded-lg h-42 sm:h-64" />
        <div className="mt-2 h-4 bg-component dark:bg-component-dark rounded w-3/4" />
        <div className="mt-1 h-3 bg-blue-50 dark:bg-gray-600 rounded w-1/2" />
    </div>
  )
}

export default SkeletonCard;