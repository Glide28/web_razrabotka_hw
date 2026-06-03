import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchCategoriesApi,
  fetchProductByIdApi,
  fetchProductsApi,
} from '../../api/client'

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchProductsApi(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const loadProductById = createAsyncThunk(
  'products/loadProductById',
  async (productId, { rejectWithValue }) => {
    try {
      return await fetchProductByIdApi(productId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const loadCategories = createAsyncThunk(
  'products/loadCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategoriesApi()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  items: [],
  selectedProduct: null,
  categories: [],
  page: 1,
  size: 100,
  total: 0,
  loading: false,
  selectedLoading: false,
  categoriesLoading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.page = action.payload.page
        state.size = action.payload.size
        state.total = action.payload.total
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Не удалось загрузить товары'
      })

      .addCase(loadProductById.pending, (state) => {
        state.selectedLoading = true
        state.error = null
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.selectedLoading = false
        state.selectedProduct = action.payload
      })
      .addCase(loadProductById.rejected, (state, action) => {
        state.selectedLoading = false
        state.error = action.payload || 'Не удалось загрузить товар'
      })

      .addCase(loadCategories.pending, (state) => {
        state.categoriesLoading = true
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false
        state.categories = action.payload || []
      })
      .addCase(loadCategories.rejected, (state) => {
        state.categoriesLoading = false
      })
  },
})

export const { clearSelectedProduct } = productsSlice.actions

export default productsSlice.reducer