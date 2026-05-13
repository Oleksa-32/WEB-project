import { Link } from 'react-router-dom';
import { formatDate, formatDuration, formatPrice } from '../utils/formatters.js';

export default function TrainCard({ train, isFastest, isCheapest }) {
  return (
    <article className="train-card">
      <div className="train-card__header">
        <div>
          <p className="train-card__type">{train.type}</p>
          <h2>{train.number}</h2>
        </div>
        <div className="train-card__badges">
          {isFastest && <span className="badge badge--green">Найшвидший</span>}
          {isCheapest && <span className="badge badge--blue">Вигідний</span>}
        </div>
      </div>

      <div className="route-line" aria-label={`${train.from} до ${train.to}`}>
        <span>{train.from}</span>
        <span className="route-line__track" />
        <span>{train.to}</span>
      </div>

      <dl className="train-details">
        <div>
          <dt>Відправлення</dt>
          <dd>
            {formatDate(train.departureDate)}, {train.departureTime}
          </dd>
        </div>
        <div>
          <dt>Прибуття</dt>
          <dd>{train.arrivalTime}</dd>
        </div>
        <div>
          <dt>Тривалість</dt>
          <dd>{formatDuration(train.durationMinutes)}</dd>
        </div>
        <div>
          <dt>Від</dt>
          <dd>{formatPrice(train.basePrice)}</dd>
        </div>
      </dl>

      <div className="train-card__footer">
        <div className="tag-list">
          {train.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <Link className="book-link" to={`/booking/${train.id}`}>
          Обрати місця
        </Link>
      </div>
    </article>
  );
}
