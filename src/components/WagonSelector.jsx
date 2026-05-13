export default function WagonSelector({
  wagons,
  activeWagonId,
  getReservedCount,
  onChange,
}) {
  return (
    <section className="booking-panel">
      <div className="section-heading">
        <p className="eyebrow">Крок 1</p>
        <h2>Оберіть вагон</h2>
      </div>

      <div className="wagon-list">
        {wagons.map((wagon) => {
          const reservedCount = getReservedCount(wagon.id);
          const freeCount = wagon.seats - reservedCount;
          const isActive = wagon.id === activeWagonId;

          return (
            <button
              key={wagon.id}
              className={`wagon-option ${isActive ? 'wagon-option--active' : ''}`}
              type="button"
              onClick={() => onChange(wagon.id)}
            >
              <span>
                <strong>{wagon.name}</strong>
                <small>{wagon.className}</small>
              </span>
              <span className="wagon-option__meta">
                {freeCount} / {wagon.seats} вільно
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
