import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { Preloader } from '@ui';
import {
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError
} from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersLoading);
  const hasError = useSelector(selectUserOrdersError);

  const { user, isAuthChecked } = useSelector((s) => s.user);

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!user) return;

    dispatch(fetchUserOrders());
  }, [dispatch, isAuthChecked, user]);

  if (!isAuthChecked) return <Preloader />;

  if (!user) return null;

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return <div>Ошибка загрузки заказов</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
