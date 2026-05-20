import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient & { id: string };
  index: number;
  totalItems: number;
};
