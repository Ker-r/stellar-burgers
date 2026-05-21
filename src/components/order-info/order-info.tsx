import { FC, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../services/store';
import {
  fetchOrderByNumber,
  resetCurrentOrder
} from '../../services/slices/orderSlice';
import { TIngredient } from '@utils-types';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const profileOrders = useSelector((state: RootState) => state.orders.orders);
  const currentOrder = useSelector(
    (state: RootState) => state.order.currentOrder
  );
  const localOrder = useMemo(() => {
    if (!number) return null;
    const orderNumber = Number(number);

    return (
      feedOrders.find((o) => o.number === orderNumber) ||
      profileOrders.find((o) => o.number === orderNumber) ||
      null
    );
  }, [feedOrders, profileOrders, number]);
  useEffect(() => {
    if (!localOrder && number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
    return () => {
      dispatch(resetCurrentOrder());
    };
  }, [localOrder, number, dispatch]);

  const orderData = localOrder || currentOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
