import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, hasError } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return <div>Ошибка загрузки ленты заказов</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
