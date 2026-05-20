import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/ordersSlice';
import type { RootState } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) {
    return <div className='text text_type_main-medium pt-4'>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className='text text_type_main-medium pt-4 text_color_error'>
        {error}
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
