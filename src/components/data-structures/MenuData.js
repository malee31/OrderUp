import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * @typedef {Object} MenuItem - An item on the menu
 * @property {string} item_id - ID of the item in the database
 * @property {string} name - Name of the item (Will be displayed)
 * @property {string} description - Description of the item (Will be displayed)
 */

/** @typedef {MenuItem[]} MenuItemList */

/**
 * @typedef {Object} MenuContextValue
 * @property {boolean} loaded - Whether the items have finished loading
 * @property {MenuItemList} menuItems - Array of all items on the menu
 * @property {function} refreshMenu - Forces the menu to refresh. Sets loaded back to false
 */

/** @type Context<MenuContextValue>|Context<{}> */
const MenuContext = createContext({});

/**
 * Allows read and refresh access to the menu and loading status
 * @return {MenuContextValue}
 */
export function useMenu() {
	// noinspection JSCheckFunctionSignatures
	return useContext(MenuContext);
}

export default function MenuProvider({ children }) {
	const [menu, setMenu] = useState([]);
	const [loaded, setLoaded] = useState(false);

	/**
	 * Loads menu items to display from the server
	 * TODO: Retry on fail optional
	 * @async
	 * @function
	 * @return {MenuItem[]}
	 */
	const refreshMenu = useCallback(() => {
		setLoaded(false);
		return fetch("/menu/list")
			.then(res => res.json())
			.then(result => setMenu(result.items))
			.catch(err => {
				console.warn("Failed to Load Menu Items");
				console.error(err);
			})
			.finally(() => setLoaded(true));
	}, [setMenu, setLoaded]);

	// noinspection JSCheckFunctionSignatures
	useEffect(() => {
		refreshMenu();
	}, [refreshMenu]);

	const menuValue = useMemo(() => {
		return {
			menuItems: menu,
			loaded: loaded,
			refreshMenu
		};
	}, [menu, loaded, refreshMenu]);

	return (
		<MenuContext.Provider value={menuValue}>
			{children}
		</MenuContext.Provider>
	);
}