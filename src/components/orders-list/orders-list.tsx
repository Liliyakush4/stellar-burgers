// список заказов с сортировкой по дате
import { FC, memo } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
// получает массив заказов через пропсы
export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const orderByDate = [...orders].sort(
    // создает копию массива и сортирует заказы так, что самый новый самый первый
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // передает отсортированный массив в UI компонент
  return <OrdersListUI orderByDate={orderByDate} />;
});
