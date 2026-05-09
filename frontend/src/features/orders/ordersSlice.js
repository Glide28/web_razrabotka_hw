import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createOrderApi } from '../../api/client'
import { clearCartState } from '../cart/cartSlice'

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (customer, { dispatch, rejectWithValue }) => {
    try {
      const order = await createOrderApi(customer)
      dispatch(clearCartState())
      return order
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  lastOrder: null,
  loading: false,
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearLastOrder(state) {
      state.lastOrder = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.lastOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Не удалось оформить заказ'
      })
  },
})

export const { clearLastOrder } = ordersSlice.actions

export default ordersSlice.reducer