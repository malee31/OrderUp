import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartContext = createContext({});

export function useCart() {
	return useContext(CartContext);
}

export default function CartProvider({ children }) {
	const [cart, setCart] = useState({
		cartId: "DEMO",
		items: [],
		loaded: false
	});

	const updateCart = useCallback(updateSlice =>
		setCart(prevState => {
			return {
				...prevState,
				...updateSlice
			}
		}), [setCart]);

	const cartValue = useMemo(() => {
		return {
			...cart,
			updateCart
		};
	}, [cart, updateCart]);

	return (
		<CartContext.Provider value={cartValue}>
			{children}
		</CartContext.Provider>
	);
}