import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(
    (state) => state.burgerConstructor // получение данных конструктора из store (выбранной булки и массива ингредиентов)
  );
  const { order, isLoading } = useSelector(
    (state) => state.order // получение данных созданного заказа
  );
  const { user } = useSelector((state) => state.user); // получение данных пользователя для проверки авторизации

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bun || isLoading) return;

    const orderIngredients = [
      bun._id,
      ...ingredients.map((ing) => ing._id),
      bun._id
    ];

    dispatch(createOrder(orderIngredients)) // диспатч заказа с id всех ингредиентов
      .unwrap() // для работы с промисом асинхронного экшена
      .then(() => {
        dispatch(clearConstructor()); // при успехе очищает конструктор
      })
      .catch((error) => {
        console.error('Ошибка создания заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isLoading}
      constructorItems={{ bun, ingredients }}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
