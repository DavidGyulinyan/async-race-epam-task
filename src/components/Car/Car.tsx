import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  startEngine,
  stopEngine,
  startDriving,
  selectCarRaceState,
  updateCarPosition,
  finishCar
} from '../../store/raceSlice';
import { updateCar } from '../../store/carsSlice';
import { Car as CarType } from '../../types';
import './Car.css';

interface CarProps {
  car: CarType;
  onSelect: (car: CarType) => void;
  onDelete: (id: number) => void;
  isSelected: boolean;
  isRaceOngoing: boolean;
}

const Car: React.FC<CarProps> = ({ car, onSelect, onDelete, isSelected, isRaceOngoing }) => {
  const dispatch = useAppDispatch();
  const carRaceState = useAppSelector(selectCarRaceState(car.id));
  const [animationDuration, setAnimationDuration] = useState<number>(0);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(car.color);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isStopping, setIsStopping] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const carRef = useRef<HTMLDivElement>(null);

  const trackRef = useRef<HTMLDivElement>(null);


  const handleSelect = () => {
    onSelect(car);
  };

  const handleRemove = () => {
    try {
      onDelete(car.id);
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
  };

  const handleStartEngine = async () => {
    if (isStarting) return;

    console.log(`Starting engine for car ${car.id}`);
    setIsStarting(true);
    setError(null);

    try {
      const result = await dispatch(startEngine(car.id)).unwrap();
      console.log(`Engine started for car ${car.id}:`, result);

      // If engine started successfully but car is not driving, try to start driving
      setTimeout(() => {
        if (carRaceState?.isStarted && !carRaceState?.isDriving && !carRaceState?.isStopped) {
          console.log(`Auto-starting driving for car ${car.id}`);
          handleStartDriving();
        }
      }, 200);
    } catch (error) {
      console.error('Failed to start engine:', error);
      setError('Failed to start engine');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopEngine = async () => {
    if (isStopping) return;

    setIsStopping(true);
    setError(null);

    try {
      if (startTimeRef.current && animationDuration > 0) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / animationDuration, 1);
        const startPosition = carRaceState?.position || 0;
        const currentPosition = startPosition + (progress * (100 - startPosition));
        dispatch(updateCarPosition({ carId: car.id, position: currentPosition }));
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      await dispatch(stopEngine(car.id)).unwrap();
      startTimeRef.current = null;
    } catch (error) {
      console.error('Failed to stop engine:', error);
      setError('Failed to stop engine');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsStopping(false);
    }
  };

  const handleResetCar = async () => {
    if (isResetting) return;

    setIsResetting(true);
    setError(null);

    try {
      // Stop engine if it's running
      if (carRaceState?.isStarted) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        await dispatch(stopEngine(car.id)).unwrap();
      }

      // Reset local state
      setCurrentPosition(0);
      setAnimationDuration(0);
      startTimeRef.current = null;

    } catch (error) {
      console.error('Failed to reset car:', error);
      setError('Failed to reset car');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsResetting(false);
    }
  };

  const handleStartDriving = useCallback(async () => {
    if (!carRaceState?.isStarted) {
      console.log(`Cannot start driving for car ${car.id} - engine not started`);
      return;
    }

    console.log(`Starting driving for car ${car.id}`);

    try {
      await dispatch(startDriving(car.id)).unwrap();
      console.log(`Successfully started driving for car ${car.id}`);
    } catch (error) {
      console.error('Failed to start driving:', error);
    }
  }, [carRaceState?.isStarted, dispatch, car.id]);

  const handleCarClick = () => {
    if (carRaceState?.isStarted) return;
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
      setSelectedColor(car.color);
    }
  };

  const handleColorPickerBlur = () => {
    setTimeout(() => setShowColorPicker(false), 150);
  };

  useEffect(() => {
    setSelectedColor(car.color);
  }, [car.color]);

  // Reset visual position when race is reset
  useEffect(() => {
    if (carRaceState?.position === 0 && !carRaceState?.isDriving) {
      setCurrentPosition(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startTimeRef.current = null;
    }
  }, [carRaceState?.position, carRaceState?.isDriving]);

  useEffect(() => {
    if (carRaceState?.isStarted && !carRaceState?.isDriving && !carRaceState?.isStopped) {
      // Small delay to ensure engine data is available
      const timer = setTimeout(() => {
        handleStartDriving();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [carRaceState?.isStarted, carRaceState?.isDriving, carRaceState?.isStopped, handleStartDriving]);

  useEffect(() => {
    if (carRaceState?.time && carRaceState.time > 0) {
      const minDuration = 2;
      const maxDuration = 10; // Prevent extremely long animations
      const duration = Math.max(minDuration, Math.min(carRaceState.time, maxDuration));
      setAnimationDuration(duration);
    } else if (!carRaceState?.isStarted) {
      setAnimationDuration(0);
      setCurrentPosition(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startTimeRef.current = null;
    }
  }, [carRaceState?.time, carRaceState?.isStarted]);

  // Reset local state when race is reset
  useEffect(() => {
    if (!carRaceState?.isStarted && !carRaceState?.isDriving && !carRaceState?.isFinished && carRaceState?.position === 0) {
      setCurrentPosition(0);
      setAnimationDuration(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startTimeRef.current = null;
    }
  }, [carRaceState?.isStarted, carRaceState?.isDriving, carRaceState?.isFinished, carRaceState?.position]);

  useEffect(() => {
    if (carRaceState?.isDriving && !carRaceState?.isStopped && animationDuration > 0) {
      console.log(`Starting animation for car ${car.id} with duration ${animationDuration}s`);

      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        const startPosition = carRaceState?.position || 0;
        setCurrentPosition(startPosition);
        console.log(`Animation started at position ${startPosition}px`);
      }

      const animate = () => {
        if (!startTimeRef.current || !trackRef.current || !carRef.current) {
          console.log('Animation cancelled - missing refs');
          return;
        }

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / animationDuration, 1);

        const trackWidth = trackRef.current.offsetWidth;
        const carWidth = carRef.current.offsetWidth;
        const maxDistance = trackWidth - carWidth - 20;
        const newPositionPx = progress * maxDistance;

        setCurrentPosition(newPositionPx);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          console.log(`Animation finished for car ${car.id}`);
          setCurrentPosition(maxDistance);
          dispatch(finishCar(car.id));
        }
      };

      // Start animation immediately
      animationRef.current = requestAnimationFrame(animate);
    } else if (!carRaceState?.isDriving || carRaceState?.isStopped) {
      // Clean up animation when not driving or stopped
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startTimeRef.current = null;
    };
  }, [carRaceState?.isDriving, carRaceState?.isStopped, animationDuration, dispatch, car.id, carRaceState?.position]);

  const getCarStatus = () => {
    if (carRaceState?.isFinished) return 'Finished';
    if (carRaceState?.isDriving) return 'Driving';
    if (carRaceState?.isStarted) return 'Engine Started';
    return 'Ready';
  };

  const getCarStatusColor = () => {
    if (carRaceState?.isFinished) return '#4CAF50';
    if (carRaceState?.isDriving) return '#2196F3';
    if (carRaceState?.isStarted) return '#FF9800';
    return '#9E9E9E';
  };

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
          disabled={isRaceOngoing}
          title={isRaceOngoing ? "Cannot remove car while any car is still racing" : "Remove car"}
        >
          Remove
        </button>
        <span className="car-item__name">{car.name}</span>
        <div
          className="car-item__status-indicator"
          style={{ backgroundColor: getCarStatusColor() }}
          title={getCarStatus()}
        >
          {getCarStatus()}
        </div>
      </div>

      {error && (
        <div className="car-item__error">
          {error}
        </div>
      )}

      <div className="car-item__race-track">
        <div className="car-item__start-controls">
          <button
            className={`car-item__btn car-item__btn--start ${isStarting ? 'car-item__btn--loading' : ''}`}
            onClick={handleStartEngine}
            disabled={carRaceState?.isStarted || isStarting || false}
          >
            A
          </button>
          {carRaceState?.isStarted && !carRaceState?.isDriving && (
            <button
              className="car-item__btn car-item__btn--drive"
              onClick={handleStartDriving}
              disabled={carRaceState?.isDriving || false}
            >
              Drive
            </button>
          )}
          <button
            className={`car-item__btn car-item__btn--stop ${isStopping ? 'car-item__btn--loading' : ''}`}
            onClick={handleStopEngine}
            disabled={!carRaceState?.isStarted || isStopping || false}
          >
            B
          </button>
          <button
            className={`car-item__btn car-item__btn--reset ${isResetting ? 'car-item__btn--loading' : ''}`}
            onClick={handleResetCar}
            disabled={isResetting || false}
          >
            {isResetting ? 'Resetting...' : 'Reset'}
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
      
      
      <div className="car-item__status-info">
        <div className="car-item__status-details">
          <span>Status: {getCarStatus()}</span>
          {carRaceState?.velocity > 0 && (
            <span>Velocity: {carRaceState.velocity} km/h</span>
          )}
          {carRaceState?.time > 0 && (
            <span>Time: {carRaceState.time.toFixed(2)}s</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Car;

