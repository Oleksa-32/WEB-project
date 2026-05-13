import { useMemo, useState } from 'react';
import { formatPrice } from '../utils/formatters.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s()-]{10,18}$/;

export default function BookingForm({
  train,
  wagon,
  selectedSeats,
  totalPrice,
  onSubmit,
  lastBooking,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const isReadyToBook = selectedSeats.length > 0;

  const routeSummary = useMemo(
    () => `${train.from} → ${train.to}, ${train.departureTime}`,
    [train],
  );

  function updateField(field, value) {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  }

  function validate() {
    const nextErrors = {};

    if (formData.fullName.trim().length < 3) {
      nextErrors.fullName = 'Вкажіть ім’я та прізвище.';
    }

    if (!phonePattern.test(formData.phone.trim())) {
      nextErrors.phone = 'Вкажіть коректний номер телефону.';
    }

    if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = 'Вкажіть коректний email.';
    }

    if (selectedSeats.length === 0) {
      nextErrors.seats = 'Оберіть хоча б одне місце.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      passenger: {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      },
      seats: selectedSeats,
      totalPrice,
    });

    setFormData({ fullName: '', phone: '', email: '' });
  }

  return (
    <section className="booking-panel booking-panel--sticky">
      <div className="section-heading">
        <p className="eyebrow">Крок 3</p>
        <h2>Дані пасажира</h2>
      </div>

      <div className="ticket-summary">
        <span>{routeSummary}</span>
        <strong>{wagon.name}</strong>
        <span>
          Місця: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'не обрано'}
        </span>
        <strong>{formatPrice(totalPrice)}</strong>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          <span>Ім’я та прізвище</span>
          <input
            value={formData.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            placeholder="Олена Петренко"
          />
          {errors.fullName && <small>{errors.fullName}</small>}
        </label>

        <label>
          <span>Телефон</span>
          <input
            value={formData.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="+380 67 123 45 67"
          />
          {errors.phone && <small>{errors.phone}</small>}
        </label>

        <label>
          <span>Email</span>
          <input
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="name@example.com"
          />
          {errors.email && <small>{errors.email}</small>}
        </label>

        {errors.seats && <p className="form-error">{errors.seats}</p>}

        <button className="book-link booking-submit" type="submit" disabled={!isReadyToBook}>
          Забронювати
        </button>
      </form>

      {lastBooking && (
        <div className="success-message" role="status">
          <strong>Бронювання створено</strong>
          <span>
            Квиток #{lastBooking.id.slice(0, 8)}: місця {lastBooking.seats.join(', ')}
          </span>
        </div>
      )}
    </section>
  );
}
