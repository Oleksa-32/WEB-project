import { useMemo, useState } from 'react';
import TrainList from '../components/TrainList.jsx';
import { trains } from '../data/trains.js';

const allTypesLabel = 'Усі типи';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState(allTypesLabel);
  const [sortMode, setSortMode] = useState('departure');

  const trainTypes = useMemo(
    () => [allTypesLabel, ...new Set(trains.map((train) => train.type))],
    [],
  );

  const visibleTrains = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredTrains = trains.filter((train) => {
      const matchesQuery = [
        train.number,
        train.from,
        train.to,
        train.type,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesType =
        typeFilter === allTypesLabel || train.type === typeFilter;

      return matchesQuery && matchesType;
    });

    return [...filteredTrains].sort((first, second) => {
      if (sortMode === 'price') {
        return first.basePrice - second.basePrice;
      }

      if (sortMode === 'duration') {
        return first.durationMinutes - second.durationMinutes;
      }

      return `${first.departureDate} ${first.departureTime}`.localeCompare(
        `${second.departureDate} ${second.departureTime}`,
      );
    });
  }, [searchQuery, sortMode, typeFilter]);

  function resetFilters() {
    setSearchQuery('');
    setTypeFilter(allTypesLabel);
    setSortMode('departure');
  }

  return (
    <main className="page-shell">
      <section className="home-hero">
        <div>
          <p className="eyebrow">Укрзалізниця · навчальна модель</p>
          <h1>Знайдіть рейс і забронюйте місця у вагоні</h1>
          <p>
            Інтерфейс показує список поїздів, фільтрує маршрути та готує перехід
            до інтерактивного вибору місць для лабораторних робіт 9-10.
          </p>
        </div>
        <div className="hero-stats" aria-label="Статистика рейсів">
          <div>
            <strong>{trains.length}</strong>
            <span>рейсів</span>
          </div>
          <div>
            <strong>{new Set(trains.map((train) => train.to)).size}</strong>
            <span>напрямків</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>бронювання</span>
          </div>
        </div>
      </section>

      <section className="search-panel" aria-label="Пошук рейсів">
        <label>
          <span>Пошук за номером або маршрутом</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Наприклад, Львів або IC 732"
          />
        </label>

        <label>
          <span>Тип поїзда</span>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            {trainTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Сортування</span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value)}
          >
            <option value="departure">За часом відправлення</option>
            <option value="duration">Спочатку найшвидші</option>
            <option value="price">Спочатку дешевші</option>
          </select>
        </label>

        <button className="ghost-button" type="button" onClick={resetFilters}>
          Очистити
        </button>
      </section>

      <TrainList trains={visibleTrains} />
    </main>
  );
}
