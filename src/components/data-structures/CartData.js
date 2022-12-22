import { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * @typedef {Object} Item - An item on the menu
 * @property {string} item_id - ID of the item in the database
 * @property {string} name - Name of the item (Will be displayed)
 * @property {string} description - Description of the item (Will be displayed)
 */

/**
 * @typedef {Object & Item} CartItem - An item in the cart
 * @property {number} count - Number of the item in the cart. This is the only additional property in CartItem not in Item
 */

/**
 * @typedef {Object} CartData
 * @property {string} cartId - ID for the cart. Should be tied to a user in the future
 * @property {CartItem[]} items - Array of items in a cart and their counts
 */

/** @type Context<CartData>|Context<{}> */
const CartContext = createContext({});


/**
 * Allows read and write access to the current cart
 * @return {CartData}
 */
export function useCart() {
	// noinspection JSCheckFunctionSignatures
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