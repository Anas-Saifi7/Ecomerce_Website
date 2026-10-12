const CART_KEY = 'cart key '

export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY)
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Error reading cart:', error)
    return []
  }
}

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event('cartUpdated'))
}

export const addToCart = (product, quantity = 1, size = 'Standard') => {
  const cart = getCart()

  const existingIndex = cart.findIndex(
    (item) => item.id === product.id && item.size === size
  )

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice || null,
      size,
      quantity,
    })
  }

  saveCart(cart)

  return cart
}

export const removeFromCart = (id, size = 'Standard') => {
  const cart = getCart().filter(
    (item) => !(item.id === id && item.size === size)
  )

  saveCart(cart)

  return cart
}

export const updateCartQuantity = (id, size, quantity) => {
  const cart = getCart()

  const item = cart.find(
    (item) => item.id === id && item.size === size
  )

  if (item) {
    item.quantity = Math.max(1, quantity)
  }

  saveCart(cart)

  return cart
}

export const clearCart = () => {
  saveCart([])
}

export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  )
}

export const getCartTotal = () => {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
}