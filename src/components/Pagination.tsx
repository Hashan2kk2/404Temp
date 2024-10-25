const Pagination = ({totalPages, activePage}: {
    totalPages: number,
    activePage: number
}) => {
    return (
        <div className="w-full flex sm:justify-between items-center flex-wrap gap-y-2">
            <div className={`flex gap-x-3 items-center justify-center w-full sm:w-fit`}>
                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (

                    <button key={page}
                            className={`flex justify-center items-center h-12 w-12 transition-colors duration-300 rounded-full hover:border-0 hover:bg-primary-900 hover:text-white ${activePage === page ? 'bg-primary text-white' : 'bg-transparent text-gray-700 border border-gray-200'}`}>{
                        page
                    }
                    </button>
                ))}
            </div>
            <div className={`flex gap-x-3 items-center justify-center w-full sm:w-fit`}>
                <button
                    className="flex justify-center items-center h-12 w-12 bg-transparent text-primary transition-colors duration-300 border border-primary-100 rounded-full hover:border-0 hover:bg-primary hover:text-white"
                    disabled={activePage === 1}>Prev
                </button>
                <button
                    className="flex justify-center items-center h-12 w-12 bg-transparent text-primary transition-colors duration-300 border border-primary-100 rounded-full hover:border-0 hover:bg-primary hover:text-white"
                    disabled={activePage === totalPages}>Next
                </button>
            </div>
        </div>
    );
}
export default Pagination;