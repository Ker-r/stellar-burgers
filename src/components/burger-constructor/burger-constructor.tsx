import { FC, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';
import { resetConstructor } from '../../services/slices/burgerConstructorSlice';
import { orderBurger, resetOrderModal } from '../../services/slices/orderSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import type { RootState } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const { orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.order
  );

  const onOrderClick = useCallback(() => {
    if (!bun || orderRequest) return;

    const token = getCookie('accessToken');
    if (!token) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(orderBurger(ingredientIds));
  }, [bun, ingredients, orderRequest, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetOrderModal());
    dispatch(resetConstructor());
  }, [dispatch]);

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  const orderForUI = orderModalData
    ? (orderModalData.order as unknown as import('@utils-types').TOrder)
    : null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderForUI}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
