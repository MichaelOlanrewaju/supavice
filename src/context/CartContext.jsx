import { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + (action.qty || 1) } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.product, qty: action.qty || 1 }] }
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'qty':
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: Math.max(0, action.qty) } : i))
          .filter((i) => i.qty > 0),
      }
    case 'clear':
      return { ...state, items: [] }
    case 'toggleSave': {
      const has = state.saved.includes(action.id)
      return {
        ...state,
        saved: has ? state.saved.filter((s) => s !== action.id) : [...state.saved, action.id],
      }
    }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [], saved: [] })

  const value = useMemo(() => {
    const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0)
    const count = state.items.reduce((s, i) => s + i.qty, 0)
    /* Delivery is quoted after the order is confirmed and is not charged at
       checkout, so the payable total is the subtotal. */
    return {
      items: state.items,
      savedIds: state.saved,
      saved: state.saved.length,
      count,
      subtotal,
      total: subtotal,
      hasPom: state.items.some((i) => i.pom),
      add: (product, qty) => dispatch({ type: 'add', product, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      setQty: (id, qty) => dispatch({ type: 'qty', id, qty }),
      clear: () => dispatch({ type: 'clear' }),
      toggleSave: (id) => dispatch({ type: 'toggleSave', id }),
      isSaved: (id) => state.saved.includes(id),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
