


const ReadFullEnqueryModal = ({onClose, name, message}) => {
    return (
      <div 
        className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
        onClick={onClose}
      >
        <div 
          className='bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 ease-out scale-100'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex justify-between items-start mb-4'>
            <h2 className='text-xl font-semibold text-gray-800'>{name}</h2>
            <button 
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 text-xl font-bold leading-none cursor-pointer'
            >
              ×
            </button>
          </div>
          <p className='text-gray-700 mb-6 leading-relaxed'>{message}</p>
        </div>
      </div>
    )
  }
  export default ReadFullEnqueryModal