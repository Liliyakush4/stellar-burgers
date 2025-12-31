import { FC, useMemo, useState, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const { ingredients } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (!number) {
      setLoading(false);
      return;
    }

    getOrderByNumberApi(parseInt(number))
      .then((res) => {
        if (res.success && res.orders.length > 0) {
          setOrderData(res.orders[0]);
        }
      })
      .catch(() => {
        console.error('Ошибка загрузки заказа');
      })
      .finally(() => setLoading(false));
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);

        if (ingredient) {
          if (!acc[item]) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          } else {
            acc[item].count++;
          }
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <div className='text text_type_main-default'>
        Данные заказа не найдены
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
