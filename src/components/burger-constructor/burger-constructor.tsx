import { FC, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderBurger, resetOrderModal } from '../../services/slices/orderSlice';
import { selectUser } from '../../services/selectors/authSelectors';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import type { RootState } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const { orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.order
  );
  const user = useSelector(selectUser);

  const onOrderClick = useCallback(() => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(orderBurger(ingredientIds));
  }, [bun, ingredients, orderRequest, user, dispatch, navigate, location]);

  const closeOrderModal = useCallback(() => {
    dispatch(resetOrderModal());
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

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
