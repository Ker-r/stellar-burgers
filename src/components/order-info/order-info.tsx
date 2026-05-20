import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import type { RootState } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  // 👇 Берём ингредиенты
  const { ingredients } = useSelector((state: RootState) => state.ingredients);

  // 👇 Берём заказы И из ленты, И из истории
  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const profileOrders = useSelector((state: RootState) => state.orders);

  // 👇 Получаем номер заказа из URL
  const { number } = useParams<{ number: string }>();

  /* Находим нужный заказ: сначала ищем в ленте, потом в истории */
  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = Number(number);

    // Сначала ищем в общей ленте
    const foundInFeed = feedOrders.find(
      (order) => order.number === orderNumber
    );
    if (foundInFeed) return foundInFeed;

    // Если не нашли, ищем в истории заказов профиля
    if (profileOrders.orders && profileOrders.orders.length > 0) {
      const foundInProfile = profileOrders.orders.find(
        (order) => order.number === orderNumber
      );
      if (foundInProfile) return foundInProfile;
    }

    return null;
  }, [feedOrders, profileOrders.orders, number]);

  /* Готовим данные для отображения */
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
