import { useCart } from "../data-structures/CartData";
import { useEffect, useState } from "react";
import CartItemDeleteConfirmation from "./CartItemDeleteConfirmation";
import { ReactComponent as MinusIcon } from "../../images/Minus.svg";
import { ReactComponent as PlusIcon } from "../../images/Plus.svg";
import { ReactComponent as RemoveIcon } from "../../images/Remove.svg";

/**
 * A single entry in the Cart sidebar
 * @param {MenuItem} item - The item in the Cart
 * @param {number} count - The number of the specified item in the Cart
 * @return {JSX.Element}
 * @constructor
 */
export default function CartItem({ item, count }) {
	const [countInputVal, setCountInputVal] = useState(count);
	const [showRemoveModal, setShowRemoveModal] = useState(false);
	const cart = useCart();
	useEffect(() => {
		// Resynchronizes the input value when an item is added to the cart from the menu
		setCountInputVal(count);
	}, [count]);

	const updateCount = newCount => {
		let newCountVal = count;
		if(typeof newCount === "number") {
			newCountVal = Math.max(0, newCount);
			// Updating the count in cart will automatically update countInputVal due to useEffect but just to be explicit:
			setCountInputVal(Math.max(1, newCount));
			// Minimum of 1 since 0 should bring up a confirmation below
		}

		if(newCountVal <= 0) {
			// TODO: Delete item from cart (Confirmation?)
			setShowRemoveModal(true);
			console.log(`Request to delete ${item.name} from cart`);
			return;
		}

		const itemIndex = cart.items.findIndex(cartItem => cartItem.item.item_id === item.item_id);
		const oldItem = cart.items[itemIndex];
		const newCartItems = [...cart.items];
		newCartItems.splice(itemIndex, 1, {
			...oldItem,
			count: newCountVal
		});
		cart.updateCart({
			items: newCartItems
		});
	};

	const removeItem = () => {
		const newCartItems = [...cart.items];
		const itemIndex = newCartItems.findIndex(cartItem => cartItem.item.item_id === item.item_id);
		newCartItems.splice(itemIndex, 1);
		cart.updateCart({
			items: newCartItems
		});
	};

	return (
		<div className="w-full mb-2 bg-slate-50 rounded relative shadow hover:shadow-md transition-shadow">
			<CartItemDeleteConfirmation itemName={item.name} show={showRemoveModal} setShow={setShowRemoveModal} onConfirm={removeItem}/>
			<div className="w-full h-full grid grid-rows-1 grid-cols-[auto_minmax(0,_1fr)_auto]">
				<button
					className="w-8 h-full px-1 text-md text-slate-400 rounded-l border-r border-slate-200 hover:bg-red-700 hover:text-slate-50 transition-colors select-none"
					onClick={() => setShowRemoveModal(true)}
				>
					<RemoveIcon/>
				</button>
				<div className="px-2 py-2">
					<h3
						title={item.name}
						className="h-min text-lg mb-1 border-b border-slate-200 overflow-x-hidden text-ellipsis whitespace-nowrap"
					>
						{item.name}
					</h3>
				</div>
				<div className="px-2 py-2 flex flex-col justify-center items-center z-10">
					<button
						className="w-6 h-6 rounded-full shadow-md z-10 bg-slate-50 box-content border border-slate-200 select-none hover:bg-slate-100"
						onClick={() => updateCount(count - 1)}
					>
						<MinusIcon/>
					</button>
					<input
						type="text"
						inputMode="numeric"
						pattern="\d*"
						className="w-6 my-0.5 text-center bg-transparent"
						onChange={e => !isNaN(Number(e.target.value)) && Number(e.target.value) >= 0 && setCountInputVal(Number(e.target.value))}
						onBlur={() => updateCount(countInputVal)}
						value={countInputVal}
					/>
					<button
						className="w-6 h-6 rounded-full shadow-md z-10 bg-orange-200 box-content border border-slate-200 select-none hover:bg-orange-300"
						onClick={() => updateCount(count + 1)}
					>
						<PlusIcon/>
					</button>
				</div>
			</div>
		</div>
	);
}