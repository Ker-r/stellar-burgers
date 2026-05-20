import { FC, useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../services/store';
import { getOrderByNumberApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

export const OrderInfo: FC = () => {
  const { ingredients } = useSelector((state: RootState) => state.ingredients);
  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const profileOrders = useSelector((state: RootState) => state.orders);

  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = Number(number);

    const foundInFeed = feedOrders.find(
      (order) => order.number === orderNumber
    );
    if (foundInFeed) return foundInFeed;

    if (profileOrders.orders && profileOrders.orders.length > 0) {
      const foundInProfile = profileOrders.orders.find(
        (order) => order.number === orderNumber
      );
      if (foundInProfile) return foundInProfile;
    }

    return null;
  }, [feedOrders, profileOrders.orders, number]);

  const [remoteOrder, setRemoteOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    if (!orderData && number) {
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.success && res.orders.length > 0) {
            setRemoteOrder(res.orders[0]);
          }
        })
        .catch((err) => {
          console.error('Failed to load order details:', err);
        });
    }
  }, [orderData, number]);

  const finalOrderData = orderData || remoteOrder;

  const orderInfo = useMemo(() => {
    if (!finalOrderData || !ingredients.length) return null;

    const date = new Date(finalOrderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = finalOrderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
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
      ...finalOrderData,
      ingredientsInfo,
      date,
      total
    };
  }, [finalOrderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
