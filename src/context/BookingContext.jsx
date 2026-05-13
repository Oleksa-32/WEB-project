import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { BookingService } from '../services/BookingService.js';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lastBooking, setLastBooking] = useState(null);
  const [bookingVersion, setBookingVersion] = useState(0);

  const toggleSeat = useCallback((seatNumber) => {
    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seatNumber)) {
        return currentSeats.filter((seat) => seat !== seatNumber);
      }

      return [...currentSeats, seatNumber].sort((first, second) => first - second);
    });
  }, []);

  const clearSelectedSeats = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const selectSeats = useCallback((seats) => {
    setSelectedSeats([...seats].sort((first, second) => first - second));
  }, []);

  const createBooking = useCallback((payload) => {
    const booking = BookingService.createBooking(payload);
    setLastBooking(booking);
    setBookingVersion((version) => version + 1);
    setSelectedSeats([]);

    return booking;
  }, []);

  const value = useMemo(
    () => ({
      selectedSeats,
      lastBooking,
      bookingVersion,
      toggleSeat,
      clearSelectedSeats,
      selectSeats,
      createBooking,
    }),
    [
      selectedSeats,
      lastBooking,
      bookingVersion,
      toggleSeat,
      clearSelectedSeats,
      selectSeats,
      createBooking,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error('useBooking must be used inside BookingProvider');
  }

  return context;
}
