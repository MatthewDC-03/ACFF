import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useApi } from '../../../hooks/useApi';

const TimeCarousel = () => {
    const { user } = useAuthContext()
    const { apiCall } = useApi()
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [amPm, setAmPm] = useState<string>('AM');
  const [dragging, setDragging] = useState(false);
  const [timeSet, setTimeSet] = useState<string>('');
  const [amPmVisibility, setAmPmVisibility] = useState<'upper' | 'lower'>('upper');
  const [timeList, setTimeList] = useState<string[]>([]);
  const [error, setError] = useState(null);
  const userId = user?.userIdLogin
  const [deleteTime, deleteSetTime] = useState<string>('');

  useEffect(()=>{
      const fetchTimes = async () => {
          try{
            const response = await apiCall(`/api/user/${userId}/get-times`)
            const times = await response.json();
            const timeOnly = times.map((item: any) => item.time);
            setTimeList(timeOnly);
          }
          catch(error: any){
            setError(error.message);
          }
      }
      if(userId){
        fetchTimes()
      }
  },[userId])

  // Common drag function for all carousels (Hour, Minute, Second)
  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: string
  ) => {
    let initialY = e.clientY;
    let direction = 0;
    let lastUpdateTime = Date.now();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentTime = Date.now();
      const deltaY = moveEvent.clientY - initialY;
      direction = Math.sign(deltaY);

      if (currentTime - lastUpdateTime > 100 && direction !== 0) {
        let newValue;
        if (type === 'hour') {
          newValue = hour + direction;
          if (newValue < 1) newValue = 12;
          if (newValue > 12) newValue = 1;
          setHour(newValue);
        } else if (type === 'minute') {
          newValue = minute + direction;
          if (newValue < 0) newValue = 59;
          if (newValue > 59) newValue = 0;
          setMinute(newValue);
        } else if (type === 'second') {
          newValue = second + direction;
          if (newValue < 0) newValue = 59;
          if (newValue > 59) newValue = 0;
          setSecond(newValue);
        } else if (type === 'ampm') {
          if (direction > 0 && amPm === 'AM') {
            setAmPm('PM');
            setAmPmVisibility('lower'); // Make lower value visible and upper hidden
          } else if (direction < 0 && amPm === 'PM') {
            setAmPm('AM');
            setAmPmVisibility('upper'); // Make upper value visible and lower hidden
          }
        }

        lastUpdateTime = currentTime;
        initialY = moveEvent.clientY;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    setDragging(true);
  };

  const handleSetTime = async () => {
    const newTime = `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}:${second.toString().padStart(2, '0')} ${amPm}`;
    setTimeSet(newTime);

    try{
        const res = await apiCall('/api/user/set-time', {
            method: 'POST',
            body: JSON.stringify({ userId, time: newTime }),
        })

        if (res.ok) {
          setTimeList((prevList) => {
            const updatedList = [...prevList, newTime];
            return updatedList.sort((a, b) => {
              const to24HourFormat = (time: string) => {
                const [h, m, s, period] = time.split(/[:\s]/);
                let hourIn24 = Number(h);
                if (period === 'PM' && hourIn24 !== 12) hourIn24 += 12;
                if (period === 'AM' && hourIn24 === 12) hourIn24 = 0;
                return hourIn24 * 3600 + Number(m) * 60 + Number(s);
              };
              return to24HourFormat(a) - to24HourFormat(b);
            });
          });
        }
    }
    catch(error){
        console.error('Error setting time:', error);
    }
  };
  

  // Reset visibility on initial load to ensure only the default AM/PM is visible
  useEffect(() => {
    setAmPmVisibility(amPm === 'AM' ? 'upper' : 'lower');
  }, [amPm]);

  const handleClickTime = (time: string) => {
    const [h, m, s, ap] = time.split(/[:\s]/);
    setHour(Number(h));
    setMinute(Number(m));
    setSecond(Number(s));
    setAmPm(ap);
  };

  const getCurrentTimeLabel = (time: string) => {
    const currentTime = `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}:${second.toString().padStart(2, '0')} ${amPm}`;
    return time === currentTime;
  };

  const sortedTimeList = timeList.sort((a, b) => {
    const to24HourFormat = (time: string) => {
      const [h, m, s, period] = time.split(/[:\s]/);
      let hourIn24 = Number(h);
      if (period === 'PM' && hourIn24 !== 12) hourIn24 += 12;
      if (period === 'AM' && hourIn24 === 12) hourIn24 = 0;
      return hourIn24 * 3600 + Number(m) * 60 + Number(s); // Return total seconds
    };

    return to24HourFormat(a) - to24HourFormat(b);
  });

  const handleDeleteTime = async (time: any) => {
    try{
        const response = await apiCall('/api/user/delete-time', {
            method: 'DELETE',
            body: JSON.stringify({ userId, time })
        })

        const result = await response.json();
        if (response.ok) {
          setTimeList((prevList) => prevList.filter((t) => t !== time));
          deleteSetTime('');
        } else {
          setError(result.message);
        }
    }
    catch(error){
        console.error(error)
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-full select-none gap-8 py-8 px-4">

      {/* Clock + Schedule row */}
      <div className='flex flex-col lg:flex-row justify-between gap-8 w-full flex-1 min-h-0'>

        {/* Clock carousel */}
        <div className='flex justify-center items-center w-full lg:flex-1'>
          <div className='relative flex flex-row gap-8 md:gap-12 justify-center w-full' style={{ paddingTop: '12rem', paddingBottom: '12rem' }}>

            <div className='absolute top-0 left-1/2 -translate-x-1/2 bg-primary w-10/12 h-1 rounded-full'></div>
            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 bg-primary w-10/12 h-1 rounded-full'></div>

            {/* Hour Carousel */}
            <div
              className="relative flex justify-center items-center cursor-grab select-none"
              onMouseDown={(e) => handleDrag(e, 'hour')}
            >
              <div className="absolute -top-36 left-0 w-full text-7xl flex justify-center items-center opacity-50">
                <div>{((hour + 1) % 12 === 0 ? 12 : (hour % 12) + 1).toString().padStart(2, '0')}</div>
              </div>
              <div className="flex justify-center font-semibold text-primary items-center text-8xl z-10">
                {hour.toString().padStart(2, '0')}
              </div>
              <div className="absolute -bottom-36 left-0 w-full text-7xl flex justify-center items-center opacity-50">
                <div>{(hour === 1 ? 12 : hour - 1).toString().padStart(2, '0')}</div>
              </div>
            </div>

            <div className="flex justify-center items-center font-semibold text-primary text-8xl z-10">:</div>

            {/* Minute Carousel */}
            <div
              className="relative flex justify-center items-center cursor-grab select-none"
              onMouseDown={(e) => handleDrag(e, 'minute')}
            >
              <div className="absolute -top-36 left-0 w-full text-7xl flex justify-center items-center opacity-50">
                <div>{(minute + 1) % 60 === 0 ? 59 : (minute + 1).toString().padStart(2, '0')}</div>
              </div>
              <div className="flex justify-center font-semibold text-primary items-center text-8xl z-10">
                {minute.toString().padStart(2, '0')}
              </div>
              <div className="absolute -bottom-36 left-0 w-full text-7xl flex justify-center items-center opacity-50">
                <div>{minute === 0 ? 59 : (minute - 1).toString().padStart(2, '0')}</div>
              </div>
            </div>

            <div className="flex justify-center items-center font-semibold text-primary text-8xl z-10">:</div>

            {/* Second Carousel */}
            <div
              className="relative flex justify-center items-center cursor-grab select-none"
              onMouseDown={(e) => handleDrag(e, 'second')}
            >
              <div className="absolute -top-36 left-0 w-full text-7xl flex justify-center items-center opacity-50">
                <div>{(second + 1) % 60 === 0 ? 59 : (second + 1).toString().padStart(2, '0')}</div>
              </div>
              <div className="flex justify-center font-semibold text-primary items-center text-8xl z-10">
                {second.toString().padStart(2, '0')}
              </div>
              <div className="absolute -bottom-36 left-0 w-full text-7xl flex justify-center items-center opacity-50">
                <div>{second === 0 ? 59 : (second - 1).toString().padStart(2, '0')}</div>
              </div>
            </div>

            {/* AM/PM Toggle */}
            <div
              className="relative flex justify-center items-center cursor-grab select-none"
              onMouseDown={(e) => handleDrag(e, 'ampm')}
            >
              <div className={`absolute -top-36 left-0 w-full text-7xl flex justify-center items-center opacity-50 ${amPmVisibility === 'upper' ? '' : 'hidden'}`}>
                PM
              </div>
              <div className="flex justify-center items-center font-semibold text-primary text-8xl z-10">{amPm}</div>
              <div className={`absolute -bottom-36 left-0 w-full text-7xl flex justify-center items-center opacity-50 ${amPmVisibility === 'lower' ? '' : 'hidden'}`}>
                AM
              </div>
            </div>

          </div>
        </div>

        {/* Schedule list */}
        <div className="flex flex-col gap-4 lg:w-48 flex-shrink-0">
          <h3 className="font-semibold text-3xl">Schedule</h3>
          <ul className='flex flex-col gap-3'>
            {sortedTimeList.map((time, index) => (
              <li key={index}>
                <button
                  onClick={() => { handleClickTime(time); deleteSetTime(time) }}
                  className={`${getCurrentTimeLabel(time) ? "bg-primary text-custom_white hover:brightness-75" : "text-black hover:bg-gray-200"} rounded-full text-xl font-semibold px-4 py-2 whitespace-pre`}
                >
                  {time}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* SET / REMOVE buttons — centered below the clock */}
      <div className='w-full flex flex-row justify-center items-center gap-6 pb-6'>
        <button onClick={handleSetTime} className="bg-primary font-semibold text-xl hover:brightness-75 text-white px-14 py-4 rounded-lg min-w-[140px]">
          SET
        </button>
        <button
          onClick={() => handleDeleteTime(deleteTime)}
          className="bg-red-500/90 font-semibold text-xl hover:brightness-75 text-white px-14 py-4 rounded-lg min-w-[140px]"
        >
          REMOVE
        </button>
      </div>

    </div>
  );
};

export default TimeCarousel;
