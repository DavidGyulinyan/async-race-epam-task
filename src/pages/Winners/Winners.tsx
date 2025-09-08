import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchWinners,
  selectWinners,
  selectTotalWinners,
  selectWinnersCurrentPage,
  selectWinnersLoading,
  selectWinnersTotalPages,
  selectWinnersSortBy,
  selectWinnersSortOrder,
  setCurrentPage,
  setSortBy,
  toggleSortOrder,
} from '../../store/winnersSlice';
import { WinnersSortBy, SortOrder } from '../../types';
import { PAGINATION } from '../../components/constants';
import './Winners.css';

const Winners: React.FC = () => {
  const dispatch = useAppDispatch();
  const winners = useAppSelector(selectWinners);
  const totalWinners = useAppSelector(selectTotalWinners);
  const currentPage = useAppSelector(selectWinnersCurrentPage);
  const isLoading = useAppSelector(selectWinnersLoading);
  const totalPages = useAppSelector(selectWinnersTotalPages);
  const sortBy = useAppSelector(selectWinnersSortBy);
  const sortOrder = useAppSelector(selectWinnersSortOrder);

  useEffect(() => {
    dispatch(
      fetchWinners({
        page: currentPage,
        limit: PAGINATION.WINNERS_PER_PAGE,
        sort: sortBy,
        order: sortOrder,
      })
    );
  }, [dispatch, currentPage, sortBy, sortOrder]);

  const handleSort = (column: WinnersSortBy) => {
    if (sortBy === column) {
      dispatch(toggleSortOrder());
    } else {
      dispatch(setSortBy(column));
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getSortIcon = (column: WinnersSortBy) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === SortOrder.ASC ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <div className="winners">
        <div className="winners__loading">Loading winners...</div>
      </div>
    );
  }

  return (
    <div className="winners">
      <div className="winners__container">
        <div className="winners__header">
          <h1 className="winners__title">Winners ({totalWinners})</h1>
          <div className="winners__page-info">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {winners.length === 0 ? (
          <div className="winners__empty">
            <div className="winners__empty-content">
              <h2>🏆 No Winners Yet!</h2>
              <p>Start racing in the garage to see winners here.</p>
            </div>
          </div>
        ) : (
          <div className="winners__table-container">
            <table className="winners__table">
              <thead>
                <tr>
                  <th className="winners__th">Number</th>
                  <th className="winners__th">Car</th>
                  <th className="winners__th">Name</th>
                  <th className="winners__th winners__th--sortable" onClick={() => handleSort(WinnersSortBy.WINS)}>
                    Wins {getSortIcon(WinnersSortBy.WINS)}
                  </th>
                  <th className="winners__th winners__th--sortable" onClick={() => handleSort(WinnersSortBy.TIME)}>
                    Best Time (seconds) {getSortIcon(WinnersSortBy.TIME)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner, index) => (
                  <tr key={winner.id} className="winners__tr">
                    <td className="winners__td">{(currentPage - 1) * PAGINATION.WINNERS_PER_PAGE + index + 1}</td>
                    <td className="winners__td">
                      <div className="winners__car-icon" style={{ color: winner.car.color }}>
                        🚗
                      </div>
                    </td>
                    <td className="winners__td winners__td--name">{winner.car.name}</td>
                    <td className="winners__td winners__td--wins">{winner.wins}</td>
                    <td className="winners__td winners__td--time">{winner.time.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="winners__pagination">
            <button
              className="winners__btn winners__btn--prev"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>

            <div className="winners__page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`winners__btn winners__btn--page ${
                      currentPage === pageNum ? 'winners__btn--active' : ''
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="winners__btn winners__btn--next"
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

export default Winners;
