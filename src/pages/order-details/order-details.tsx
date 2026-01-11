import { FC } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { OrderDetailsUI } from '@ui';

export const OrderDetails: FC = () => {
  const { number } = useParams<{ number: string }>();

  const orderNumber = Number(number);

  if (!number || Number.isNaN(orderNumber)) {
    return <Navigate to='/' replace />;
  }

  return <OrderDetailsUI orderNumber={orderNumber} />;
};
