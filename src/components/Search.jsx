
const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div>
        <input 
            type="text" 
            placeholder="Search titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-150 bg-component dark:bg-component-dark rounded-lg
            px-4 py-3 text-gray-900 dark:text-gray-400 placeholder-gray-400 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-component-hover-dark dark:focus:border-component-hover-dark"
        />
    </div>
  )
}

export default Search