import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  addCartItemApi,
  deleteCartItemApi,
  fetchCartApi,
  updateCartItemApi,
} from '../../api/client'

export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCartApi()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      await addCartItemApi(productId, quantity)
      return await dispatch(loadCart()).unwrap()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ cartItemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await updateCartItemApi(cartItemId, quantity)
      return await dispatch(loadCart()).unwrap()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (cartItemId, { dispatch, rejectWithValue }) => {
    try {
      await deleteCartItemApi(cartItemId)
      return await dispatch(loadCart()).unwrap()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  items: [],
  totalAmount: 0,
  sessionId: null,
  loading: false,
  actionLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState(state) {
      state.items = []
      state.totalAmount = 0
      state.sessionId = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.totalAmount = Number(action.payload.total_amount || 0)
        state.sessionId = action.payload.session_id
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Не удалось загрузить корзину'
      })

      .addCase(addItemToCart.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.actionLoading = false
        state.items = action.payload.items || []
        state.totalAmount = Number(action.payload.total_amount || 0)
        state.sessionId = action.payload.session_id
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload || 'Не удалось добавить товар'
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.actionLoading = false
        state.items = action.payload.items || []
        state.totalAmount = Number(action.payload.total_amount || 0)
        state.sessionId = action.payload.session_id
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload || 'Не удалось обновить количество'
      })

      .addCase(removeCartItem.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.actionLoading = false
        state.items = action.payload.items || []
        state.totalAmount = Number(action.payload.total_amount || 0)
        state.sessionId = action.payload.session_id
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload || 'Не удалось удалить товар'
      })
  },
})

export const { clearCartState } = cartSlice.actions

export default cartSlice.reducer