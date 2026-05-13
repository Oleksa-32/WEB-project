import { Link, useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm.jsx';
import SeatMap from '../components/SeatMap.jsx';
import WagonSelector from '../components/WagonSelector.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { trains } from '../data/trains.js';
import { BookingService } from '../services/BookingService.js';
import { formatDate, formatDuration, formatPrice } from '../utils/formatters.js';
import { useMemo, useState } from 'react';

function getWagonPrice(train, wagon) {
  if (wagon.className === '1 клас') {
    return Math.round(train.basePrice * 1.35);
  }

  if (wagon.className === 'Купе') {
    return Math.round(train.basePrice * 1.15);
  }

  if (wagon.className === 'Плацкарт') {
    return Math.round(train.basePrice * 0.88);
  }

  return train.basePrice;
}

export default function Booking() {
  const { trainId } = useParams();
  const train = trains.find((item) => item.id === trainId);
  const {
    selectedSeats,
    lastBooking,
    bookingVersion,
    toggleSeat,
    clearSelectedSeats,
    selectSeats,
    createBooking,
  } = useBooking();
  const [activeWagonId, setActiveWagonId] = useState(train?.wagons[0]?.id);

  const activeWagon = train?.wagons.find((wagon) => wagon.id === activeWagonId);

  const reservedSeats = useMemo(() => {
    if (!train || !activeWagon) {
      return [];
    }

    return BookingService.getReservedSeats(train.id, activeWagon.id);
  }, [activeWagon, train, bookingVersion]);

  if (!train || !activeWagon) {
    return (
      <main className="page-shell">
        <section className="empty-state">
          <h1>Рейс не знайдено</h1>
          <p>Поверніться до списку та оберіть доступний поїзд.</p>
          <Link className="book-link" to="/">
            До рейсів
          </Link>
        </section>
      </main>
    );
  }

  const seatPrice = getWagonPrice(train, activeWagon);
  const totalPrice = selectedSeats.length * seatPrice;
  const freeSeatCount = activeWagon.seats - reservedSeats.length;

  function handleWagonChange(wagonId) {
    setActiveWagonId(wagonId);
    clearSelectedSeats();
  }

  function handleAutoPickSeats() {
    const reservedSet = new Set(reservedSeats);

    for (let seat = 1; seat < activeWagon.seats; seat += 1) {
      const isPairAvailable = !reservedSet.has(seat) && !reservedSet.has(seat + 1);

      if (isPairAvailable) {
        selectSeats([seat, seat + 1]);
        return;
      }
    }
  }

  function handleBookingSubmit({ passenger, seats, totalPrice: price }) {
    createBooking({
      trainId: train.id,
      trainNumber: train.number,
      route: `${train.from} → ${train.to}`,
      wagonId: activeWagon.id,
      wagonName: activeWagon.name,
      passenger,
      seats,
      totalPrice: price,
    });
  }

  return (
    <main className="page-shell booking-page">
      <Link className="back-link" to="/">
        ← До списку рейсів
      </Link>

      <section className="booking-hero">
        <div>
          <p className="eyebrow">Бронювання квитка</p>
          <h1>
            {train.number}: {train.from} → {train.to}
          </h1>
          <p>
            {formatDate(train.departureDate)}, відправлення {train.departureTime},
            тривалість {formatDuration(train.durationMinutes)}.
          </p>
        </div>
        <div className="price-tile">
          <span>Ціна за місце</span>
          <strong>{formatPrice(seatPrice)}</strong>
          <small>{activeWagon.className}</small>
        </div>
      </section>

      <section className="booking-metrics" aria-label="Стан бронювання">
        <div>
          <span>Вагон</span>
          <strong>{activeWagon.name}</strong>
        </div>
        <div>
          <span>Вільно</span>
          <strong>{freeSeatCount}</strong>
        </div>
        <div>
          <span>Обрано</span>
          <strong>{selectedSeats.length}</strong>
        </div>
        <div>
          <span>Сума</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>
      </section>

      <div className="booking-layout">
        <div className="booking-main">
          <WagonSelector
            wagons={train.wagons}
            activeWagonId={activeWagon.id}
            getReservedCount={(wagonId) =>
              BookingService.getReservedSeats(train.id, wagonId).length
            }
            onChange={handleWagonChange}
          />
          <SeatMap
            wagon={activeWagon}
            reservedSeats={reservedSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={toggleSeat}
            onAutoPickSeats={handleAutoPickSeats}
            onClearSeats={clearSelectedSeats}
          />
        </div>
        <BookingForm
          train={train}
          wagon={activeWagon}
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onSubmit={handleBookingSubmit}
          lastBooking={lastBooking}
        />
      </div>
    </main>
  );
}
