import TrainCard from './TrainCard.jsx';

export default function TrainList({ trains }) {
  if (trains.length === 0) {
    return (
      <div className="empty-state">
        <h2>Рейсів не знайдено</h2>
        <p>Спробуйте змінити пошуковий запит або фільтр типу поїзда.</p>
      </div>
    );
  }

  const fastestMinutes = Math.min(...trains.map((train) => train.durationMinutes));
  const cheapestPrice = Math.min(...trains.map((train) => train.basePrice));

  return (
    <div className="train-grid">
      {trains.map((train) => (
        <TrainCard
          key={train.id}
          train={train}
          isFastest={train.durationMinutes === fastestMinutes}
          isCheapest={train.basePrice === cheapestPrice}
        />
      ))}
    </div>
  );
}
