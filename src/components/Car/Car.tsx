import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  startEngine,
  stopEngine,
  startDriving,
  selectCarRaceState,
  updateCarPosition,
  finishCar
} from '../../store/raceSlice';
import { deleteCar, setSelectedCar, updateCar } from '../../store/carsSlice';
import { Car as CarType } from '../../types';
import './Car.css';

interface CarProps {
  car: CarType;
  onSelect: (car: CarType) => void;
  isSelected: boolean;
}

const Car: React.FC<CarProps> = ({ car, onSelect, isSelected }) => {
  const dispatch = useAppDispatch();
  const carRaceState = useAppSelector(selectCarRaceState(car.id));
  const [animationDuration, setAnimationDuration] = useState<number>(0);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(car.color);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const carRef = useRef<HTMLDivElement>(null);

  const trackRef = useRef<HTMLDivElement>(null);


  const handleSelect = () => {
    onSelect(car);
  };

  const handleRemove = async () => {
    try {
      await dispatch(deleteCar(car.id)).unwrap();
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  const handleStartEngine = async () => {
    try {
      await dispatch(startEngine(car.id)).unwrap();
    } catch (error) {
      console.error('Failed to start engine:', error);
    }
  };

  const handleStopEngine = async () => {
    try {
      // Calculate current position before stopping
      if (startTimeRef.current && animationDuration > 0) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / animationDuration, 1);
        const startPosition = carRaceState?.position || 0;
        const currentPosition = startPosition + (progress * (100 - startPosition));
        dispatch(updateCarPosition({ carId: car.id, position: currentPosition }));
      }

      // Cancel animation frame if running
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      await dispatch(stopEngine(car.id)).unwrap();
      // Don't reset animation duration immediately to allow for restart
      startTimeRef.current = null;
    } catch (error) {
      console.error('Failed to stop engine:', error);
    }
  };

  const handleStartDriving = async () => {
    if (!carRaceState?.isStarted) {
      return;
    }
    
    try {
      await dispatch(startDriving(car.id)).unwrap();
    } catch (error) {
      console.error('Failed to start driving:', error);
    }
  };

  const handleCarClick = () => {
    if (carRaceState?.isStarted) {
      return; // Don't allow color change during race
    }
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChange = async (newColor: string) => {
    setSelectedColor(newColor);
    try {
      await dispatch(updateCar({
        id: car.id,
        car: {
          name: car.name,
          color: newColor,
        },
      })).unwrap();
      setShowColorPicker(false);
    } catch (error) {
      console.error('Failed to update car color:', error);
      setSelectedColor(car.color); // Revert on error
    }
  };

  const handleColorPickerBlur = () => {
    setTimeout(() => setShowColorPicker(false), 150); // Small delay to allow color selection
  };

  // Update selected color when car prop changes
  useEffect(() => {
    setSelectedColor(car.color);
  }, [car.color]);

  // Auto-start driving when engine is started
  useEffect(() => {
    if (carRaceState?.isStarted && !carRaceState?.isDriving) {
      // Start driving immediately without delay
      handleStartDriving();
    }
  }, [carRaceState?.isStarted, carRaceState?.isDriving]);

  // Update animation duration from race state
  useEffect(() => {
    if (carRaceState?.time) {
      // Ensure minimum animation duration for visibility
      const minDuration = 2; // Minimum 2 seconds for better visibility
      const duration = Math.max(carRaceState.time, minDuration);
      setAnimationDuration(duration);
    } else if (!carRaceState?.isStarted) {
      // Reset animation duration and position when engine is not started
      setAnimationDuration(0);
      setCurrentPosition(0);
      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [carRaceState?.time, carRaceState?.isStarted]);

  // Start timing when driving begins (for stop position calculation)
  useEffect(() => {
    if (carRaceState?.isDriving && !carRaceState?.isStopped) {
      // Start animation even if duration is not set yet (use fallback)
      const currentDuration = animationDuration > 0 ? animationDuration : 2; // Fallback to 2 seconds

      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        // Start from stopped position if car was previously stopped, otherwise from 0
        const startPosition = carRaceState?.position || 0;
        setCurrentPosition(startPosition);
      }

      // Start JavaScript animation
      const animate = () => {
  if (!startTimeRef.current || !trackRef.current || !carRef.current) return;

  const elapsed = (Date.now() - startTimeRef.current) / 1000;
  const progress = Math.min(elapsed / currentDuration, 1);

  const trackWidth = trackRef.current.offsetWidth;
  const carWidth = carRef.current.offsetWidth;

  // Calculate max distance in px
  const maxDistance = trackWidth - carWidth - 20; 

  const newPositionPx = progress * maxDistance;
  setCurrentPosition(newPositionPx);

  if (progress < 1) {
    animationRef.current = requestAnimationFrame(animate);
  } else {
    setCurrentPosition(maxDistance); // ensure car ends at finish line
    dispatch(finishCar(car.id));
  }
};

      // Start animation immediately
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [carRaceState?.isDriving, carRaceState?.isStopped, animationDuration, dispatch, car.id, carRaceState?.position]);

  return (
    <div className={`car-item ${isSelected ? 'car-item--selected' : ''}`}>
      <div className="car-item__controls">
        <button 
          className="car-item__btn car-item__btn--select"
          onClick={handleSelect}
        >
          Select
        </button>
        <button 
          className="car-item__btn car-item__btn--remove"
          onClick={handleRemove}
        >
          Remove
        </button>
        <span className="car-item__name">{car.name}</span>
      </div>
      
      <div className="car-item__race-track">
        <div className="car-item__start-controls">
          <button 
            className="car-item__btn car-item__btn--start"
            onClick={handleStartEngine}
            disabled={carRaceState?.isStarted || false}
          >
            A
          </button>
          <button 
            className="car-item__btn car-item__btn--stop"
            onClick={handleStopEngine}
            disabled={!carRaceState?.isStarted || false}
          >
            B
          </button>
        </div>
        
        <div className="car-item__track" ref={trackRef}>
          <div className="car-item__car-container">
            <div
              ref={carRef}
              className={`car-item__car ${
                carRaceState?.isFinished ? 'car-item__car--finished' : ''
              } ${
                !carRaceState?.isStarted ? 'car-item__car--clickable' : ''
              }`}
              style={{
                color: selectedColor,
                transform:  `translateX(${currentPosition}px)`,
                transition: carRaceState?.isStopped || carRaceState?.isFinished ? 'none' : 'transform 0.1s linear',
              }}
              onClick={handleCarClick}
              title={carRaceState?.isStarted ? 'Cannot change color during race' : 'Click to change color'}
            >
              <svg
                width="40"
                height="24"
                viewBox="0 0 40 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 18C6.34 18 5 16.66 5 15C5 13.34 6.34 12 8 12C9.66 12 11 13.34 11 15C11 16.66 9.66 18 8 18ZM32 18C30.34 18 29 16.66 29 15C29 13.34 30.34 12 32 12C33.66 12 35 13.34 35 15C35 16.66 33.66 18 32 18ZM37 7H31L28 2H12L9 7H3C1.9 7 1 7.9 1 9V15C1 16.1 1.9 17 3 17H5C5 19.21 6.79 21 9 21H11C13.21 21 15 19.21 15 17H25C25 19.21 26.79 21 29 21H31C33.21 21 35 19.21 35 17H37C38.1 17 39 16.1 39 15V9C39 7.9 38.1 7 37 7Z"/>
              </svg>
            </div>
            {showColorPicker && (
              <div className="car-item__color-picker">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  onBlur={handleColorPickerBlur}
                  autoFocus
                />
              </div>
            )}
          </div>
          <div className="car-item__finish-line">🏁</div>
        </div>
      </div>
      
      
      {carRaceState?.isFinished && (
        <div className="car-item__status car-item__status--finished">
          Finished! 🏆
        </div>
      )}
    </div>
  );
};

export default Car;
