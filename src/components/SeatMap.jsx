export default function SeatMap({
  wagon,
  reservedSeats,
  selectedSeats,
  onToggleSeat,
  onAutoPickSeats,
  onClearSeats,
}) {
  const reservedSet = new Set(reservedSeats);
  const selectedSet = new Set(selectedSeats);
  const seats = Array.from({ length: wagon.seats }, (_, index) => index + 1);

  return (
    <section className="booking-panel">
      <div className="section-heading section-heading--inline">
        <div>
          <p className="eyebrow">Крок 2</p>
          <h2>Схема місць</h2>
        </div>
        <div className="seat-tools">
          <div className="seat-legend" aria-label="Позначення місць">
            <span><i className="seat-dot seat-dot--free" /> Вільне</span>
            <span><i className="seat-dot seat-dot--selected" /> Обране</span>
            <span><i className="seat-dot seat-dot--reserved" /> Зайняте</span>
          </div>
          <div className="seat-actions">
            <button className="ghost-button" type="button" onClick={onAutoPickSeats}>
              2 поруч
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={onClearSeats}
              disabled={selectedSeats.length === 0}
            >
              Скинути
            </button>
          </div>
        </div>
      </div>

      <div className="wagon-shell" aria-label={`Схема місць: ${wagon.name}`}>
        <div className="wagon-shell__label">Вхід</div>
        <div className="seat-grid">
          {seats.map((seat) => {
            const isReserved = reservedSet.has(seat);
            const isSelected = selectedSet.has(seat);
            const stateClass = isReserved
              ? 'seat-button--reserved'
              : isSelected
                ? 'seat-button--selected'
                : 'seat-button--free';

            return (
              <button
                key={seat}
                className={`seat-button ${stateClass}`}
                type="button"
                disabled={isReserved}
                onClick={() => onToggleSeat(seat)}
                aria-pressed={isSelected}
                aria-label={`Місце ${seat}`}
              >
                {seat}
              </button>
            );
          })}
        </div>
        <div className="wagon-shell__label">Тамбур</div>
      </div>
    </section>
  );
}
