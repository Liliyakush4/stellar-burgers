// презентационнный UI-компонент
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './orders-list.module.css';
import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

// получает отсортированный массив заказов
export const OrdersListUI: FC<OrdersListUIProps> = ({ orderByDate }) => {
  const location = useLocation();

  return (
    <div className={`${styles.content}`}>
      {orderByDate.map(
        (
          order // преобразует массив заказов в массив элементов
        ) => (
          // рендер карточки для каждого заказа
          <Link
            key={order._id}
            to={`/feed/${order.number}`}
            state={{ background: location }}
          >
            <OrderCard order={order} />
          </Link>
        )
      )}
    </div>
  );
};
