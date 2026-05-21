import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredientsIds: string[]) => {
    const data = await orderBurgerApi(ingredientsIds);
    return data.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  currentOrderLoading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderModal: (state) => {
      state.orderModalData = null;
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload ?? null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { resetOrderModal, resetCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
