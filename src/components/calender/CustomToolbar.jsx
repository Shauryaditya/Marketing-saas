import { format } from 'date-fns';
import { useCalenderContext } from '../../contexts/CalenderContext';
function CustomToolbar() {
  const { handleTodayClick, handleNavigationClick, currentDate, view, setView } = useCalenderContext()
  return (
    <div className="flex justify-between items-center mb-3 ">
      <div className='text-2xl '>
        {format(currentDate, 'MMMM dd, yyyy')}
      </div>
      <div className='flex justify-center space-x-1'>
        <button className={`${view === 'month' ? 'bg-gray-100' : 'bg-white'} py-1 px-4  border rounded text-xs`} onClick={() => setView('month')}>
          Month
        </button>
        <button className={`${view === 'week' ? 'bg-gray-100' : 'bg-white'} py-1 px-4 border rounded text-xs`} onClick={() => setView('week')}>
          Week
        </button>
        <button className={`${view === 'day' ? 'bg-gray-100' : 'bg-white'} py-1 px-4  border rounded text-xs `} onClick={() => setView('day')}>
          Day
        </button>
      </div>
      <div className='flex justify-center items-end space-x-1'>
        <button
          onClick={() => handleNavigationClick(view, "back")}
          className='bg-white rounded-sm shadow-sm py-0.5 px-1'
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </span>
        </button>
        <button
          className="bg-white rounded-sm shadow-sm py-0.5 px-1"
          onClick={() => handleTodayClick()}
        >
          Today
        </button>
        <button
          className='bg-white rounded-sm shadow-sm py-0.5 px-1'
          onClick={() => handleNavigationClick(view, "next")}
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </button>
      </div >
    </div >
  );
}

export default CustomToolbar;
