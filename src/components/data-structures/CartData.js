import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * @typedef {Object} CartItem - An item in the cart
 * @property {MenuItem} item - The item in the cart
 * @property {number} count - Number of the item in the cart
 */

/**
 * @typedef {Object} CartData
 * @property {string} cartId - ID for the cart. Should be tied to a user in the future
 * @property {CartItem[]} items - Array of items in a cart and their counts
 */

/**
 * @typedef {Object & CartData} CartContextValue
 * @property {function} updateCart - Overwrites the current cart with the portion of data given to this function. Unspecified properties are unaffected
 * @property {function} addItem - Given an item object, the item is added to the cart with a count of 1 or the count is increased
 */

/** @type Context<CartContextValue>|Context<{}> */
const CartContext = createContext({});


/**
 * Allows read and write access to the current cart
 * @return {CartContextValue}
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

	const addItem = useCallback(item => {
		const cartItemClone = [...cart.items];
		const incrementItem = cartItemClone.find(cartItem => cartItem.item.item_id === item.item_id);
		if(incrementItem) {
			incrementItem.count++;
		} else {
			cartItemClone.push({
				item: item,
				count: 1
			});
		}
		updateCart({ items: cartItemClone });
	}, [updateCart, cart.items]);

	const cartValue = useMemo(() => {
		return {
			...cart,
			addItem,
			updateCart
		};
	}, [cart, addItem, updateCart]);

	// Attempt to load cart from server
	useEffect(() => {
		console.log(`Attempt to fetch cart ${cartValue.cartId}`);
		fetch(`/cart/view/${cartValue.cartId}`)
			.then(res => res.json())
			.then(loadedCart => {
				console.log(loadedCart);
				if(!loadedCart["cart_id"] || !loadedCart["items"]) {
					console.warn("Could not find expected properties in loaded cart:");
					console.dir(loadedCart);
					return;
				}
				updateCart({ cartId: loadedCart["cart_id"], items: loadedCart["items"], loaded: true });
			})
			.catch(err => {
				console.warn("Failed to load the cart:");
				console.error(err);
			});
	}, [updateCart, cartValue.cartId]);

	const antiRaceConditionSyncQueue = useRef([]);
	const antiRaceExecuting = useRef(false);

	// Syncs cart with server
	useEffect(() => {
		// Avoid synching an empty cart before loading in the cart in the first place
		if(!cartValue.loaded) return;
		// TODO: Remove unnecessary initial save that occurs as a result of loading the cart changing cartValue.items


		const syncRequestFunc = () => {
			// console.log("Cart Syncing!")
			return fetch("/cart/sync", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cart_id: cartValue.cartId,
					items: cartValue.items
				})
			})
				.then(res => res.text())
				.then(console.log)
				.catch(err => {
					console.log("Unable to sync cart with server:");
					console.error(err);
				})
		};

		const executeQueue = async () => {
			// Prevent queue promises being run on by two calls at the same time
			if(antiRaceExecuting.current) {
				// console.log("Concurrent sync avoided");
				return;
			}
			antiRaceExecuting.current = true;

			while(antiRaceConditionSyncQueue.current.length) {
				// Shortcut applied: Syncs always overwrite so only the last item in the queue matters (Outer while loop in case a new sync is added while this one is running)
				while(antiRaceConditionSyncQueue.current.length > 1) {
					// console.log("Sync Queue Shortcut Applied");
					antiRaceConditionSyncQueue.current.shift();
				}
				// console.log("EXECUTE SYNC")
				await antiRaceConditionSyncQueue.current.shift()();
			}

			// Re-enable execution
			antiRaceExecuting.current = false;
			// console.log("Sync Queue Cleared")
		};

		antiRaceConditionSyncQueue.current.push(syncRequestFunc);
		// Silently execute queue
		executeQueue().catch(() => {});
	}, [cartValue.cartId, cartValue.items, cartValue.loaded]);

	return (
		<CartContext.Provider value={cartValue}>
			{children}
		</CartContext.Provider>
	);
}