import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchCars,
  createCar,
  updateCar,
  deleteCar,
  generateRandomCars,
  selectCars,
  selectTotalCars,
  selectCurrentPage,
  selectCarsLoading,
  selectTotalPages,
  selectSelectedCar,
  setSelectedCar,
  setCurrentPage,
} from "../../store/carsSlice";
import {
  startRace,
  resetRace,
  selectRaceStatus,
  selectRaceWinner,
  selectRaceTime,
  selectRaceCars,
  initializeCar,
} from "../../store/raceSlice";
import { RaceStatus, Car as CarType } from "../../types";
import { PAGINATION } from "../../components/constants";
import Car from "../../components/Car/Car";
import "./Garage.css";

const Garage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cars = useAppSelector(selectCars);
  const totalCars = useAppSelector(selectTotalCars);
  const currentPage = useAppSelector(selectCurrentPage);
  const isLoading = useAppSelector(selectCarsLoading);
  const totalPages = useAppSelector(selectTotalPages);
  const selectedCar = useAppSelector(selectSelectedCar);
  const raceStatus = useAppSelector(selectRaceStatus);
  const raceWinner = useAppSelector(selectRaceWinner);
  const raceTime = useAppSelector(selectRaceTime);
  const raceCars = useAppSelector(selectRaceCars);

  const [createCarName, setCreateCarName] = useState("");
  const [createCarColor, setCreateCarColor] = useState("#ff0000");
  const [updateCarName, setUpdateCarName] = useState("");
  const [updateCarColor, setUpdateCarColor] = useState("#ff0000");

  useEffect(() => {
    dispatch(
      fetchCars({
        page: currentPage,
        limit: PAGINATION.GARAGE_CARS_PER_PAGE,
      })
    );
  }, [dispatch, currentPage]);

  // Initialize race state for all cars
  useEffect(() => {
    cars.forEach((car) => {
      dispatch(initializeCar(car.id));
    });
  }, [cars, dispatch]);

  // Update form when car is selected
  useEffect(() => {
    if (selectedCar) {
      setUpdateCarName(selectedCar.name);
      setUpdateCarColor(selectedCar.color);
    }
  }, [selectedCar]);


  const handleCreateCar = async () => {
    if (!createCarName.trim()) return;

    try {
      await dispatch(
        createCar({
          name: createCarName.trim(),
          color: createCarColor,
        })
      ).unwrap();

      setCreateCarName("");
      setCreateCarColor("#ff0000");

      // Refresh cars if we're on the current page
      dispatch(
        fetchCars({
          page: currentPage,
          limit: PAGINATION.GARAGE_CARS_PER_PAGE,
        })
      );
    } catch (error) {
      console.error("Failed to create car:", error);
    }
  };

  const handleUpdateCar = async () => {
    if (!selectedCar || !updateCarName.trim()) return;

    try {
      await dispatch(
        updateCar({
          id: selectedCar.id,
          car: {
            name: updateCarName.trim(),
            color: updateCarColor,
          },
        })
      ).unwrap();

      // Refresh cars
      dispatch(
        fetchCars({
          page: currentPage,
          limit: PAGINATION.GARAGE_CARS_PER_PAGE,
        })
      );
    } catch (error) {
      console.error("Failed to update car:", error);
    }
  };

  const handleGenerateRandomCars = async () => {
    try {
      await dispatch(generateRandomCars(100)).unwrap();

      // Refresh cars
      dispatch(
        fetchCars({
          page: currentPage,
          limit: PAGINATION.GARAGE_CARS_PER_PAGE,
        })
      );
    } catch (error) {
      console.error("Failed to generate cars:", error);
    }
  };

  const handleStartRace = async () => {
    if (cars.length === 0) return;

    try {
      await dispatch(startRace(cars)).unwrap();
    } catch (error) {
      console.error("Failed to start race:", error);
    }
  };

  const handleResetRace = async () => {
    try {
      await dispatch(resetRace(cars)).unwrap();
    } catch (error) {
      console.error("Failed to reset race:", error);
    }
  };

  const handleSelectCar = (car: CarType) => {
    dispatch(setSelectedCar(car));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  if (isLoading) {
    return (
      <div className="garage">
        <div className="garage__loading">Loading cars...</div>
      </div>
    );
  }

  return (
    <div className="garage">
      <div className="garage__container">
        <div className="garage__header">
          <h1 className="garage__title">Garage ({totalCars})</h1>
          <div className="garage__page-info">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {raceWinner && raceStatus === RaceStatus.FINISHED && Object.values(raceCars).every(car => car.isFinished) && (
          <div className="garage__winner-banner">
            🏆 Winner: {raceWinner.name} - Time: {raceTime.toFixed(2)} seconds! 🏆
          </div>
        )}

        <div className="garage__controls">
          <div className="garage__control-panel">
            <div className="garage__car-controls">
              <input
                type="text"
                placeholder="Car name"
                className="garage__input"
                value={createCarName}
                onChange={(e) => setCreateCarName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateCar()}
              />
              <input
                type="color"
                className="garage__color-picker"
                value={createCarColor}
                onChange={(e) => setCreateCarColor(e.target.value)}
              />
              <button
                className="garage__btn garage__btn--create"
                onClick={handleCreateCar}
                disabled={!createCarName.trim()}
              >
                Create
              </button>
            </div>

            <div className="garage__car-controls">
              <input
                type="text"
                placeholder="Update car name"
                className="garage__input"
                value={updateCarName}
                onChange={(e) => setUpdateCarName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleUpdateCar()}
                disabled={!selectedCar}
              />
              <input
                type="color"
                className="garage__color-picker"
                value={updateCarColor}
                onChange={(e) => setUpdateCarColor(e.target.value)}
                disabled={!selectedCar}
              />
              <button
                className="garage__btn garage__btn--update"
                onClick={handleUpdateCar}
                disabled={!selectedCar || !updateCarName.trim()}
              >
                Update
              </button>
            </div>
          </div>

          <div className="garage__race-controls">
            <button
              className="garage__btn garage__btn--race"
              onClick={handleStartRace}
              disabled={cars.length === 0 || raceStatus === RaceStatus.RACING}
            >
              {raceStatus === RaceStatus.RACING ? "Racing..." : "Race"}
            </button>
            <button
              className="garage__btn garage__btn--reset"
              onClick={handleResetRace}
              disabled={raceStatus === RaceStatus.IDLE}
            >
              Reset
            </button>
            <button
              className="garage__btn garage__btn--generate"
              onClick={handleGenerateRandomCars}
              disabled={raceStatus === RaceStatus.RACING}
            >
              Generate Cars
            </button>
          </div>
        </div>

        <div className="garage__cars">
          {cars.length === 0 ? (
            <div className="garage__empty">
              No cars in garage. Create some cars to start racing!
            </div>
          ) : (
            cars.map((car) => {
              const isAnyCarStillRacing = Object.values(raceCars).some(carState =>
                carState?.isDriving && !carState?.isFinished
              );

              return (
                <Car
                  key={car.id}
                  car={car}
                  onSelect={handleSelectCar}
                  onDelete={(id) => dispatch(deleteCar({ id, page: currentPage, limit: PAGINATION.GARAGE_CARS_PER_PAGE }))}
                  isSelected={selectedCar?.id === car.id}
                  isRaceOngoing={isAnyCarStillRacing}
                />
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="garage__pagination">
            <button
              className="garage__btn garage__btn--prev"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span className="garage__page-indicator">
              {currentPage} / {totalPages}
            </span>
            <button
              className="garage__btn garage__btn--next"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Garage;
