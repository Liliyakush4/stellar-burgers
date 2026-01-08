import { FC, useMemo, useState, useEffect } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    ingredients,
    isLoading: ingredientsLoading,
    hasError: ingredientsError
  } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (!number) {
      setLoading(false);
      return;
    }

    const orderNumber = Number(number);
    if (Number.isNaN(orderNumber)) {
      setOrderData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getOrderByNumberApi(Number(number))
      .then((res) => {
        if (res.success && res.orders.length > 0) {
          setOrderData(res.orders[0]);
        } else {
          setOrderData(null);
        }
      })
      .catch(() => setOrderData(null))
      .finally(() => setLoading(false));
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData) return null;
    if (!ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const orderIngredients = orderData.ingredients ?? [];
    const ingredientsInfo: TIngredientsWithCount = orderIngredients.reduce(
      (acc, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (!ingredient) return acc;

        acc[item] = acc[item]
          ? { ...acc[item], count: acc[item].count + 1 }
          : { ...ingredient, count: 1 };

        return acc;
      },
      {} as TIngredientsWithCount
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

  if (loading || ingredientsLoading) {
    return <Preloader />;
  }

  if (!ingredients.length) {
    if (ingredientsError) {
      return (
        <div className='text text_type_main-default'>
          Ошибка загрузки ингредиентов
        </div>
      );
    }
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
