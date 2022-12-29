import { useCart } from "../data-structures/CartData";
import { ReactComponent as ChevronRight } from "../../images/ChevronRight.svg";
import { ReactComponent as CartIcon } from "../../images/Cart.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import clickInsideOf from "../../utilities/clickInsideOf";
import { ReactComponent as MinusIcon } from "../../images/Minus.svg";
import { ReactComponent as PlusIcon } from "../../images/Plus.svg";
import { ReactComponent as RemoveIcon } from "../../images/Remove.svg";

export default function Cart({ show, setShow }) {
	const cart = useCart();
	const numCartItems = cart.items.reduce((prev, curr) => prev + curr.count, 0);
	const showCart = useCallback(() => setShow(true), [setShow]);
	const hideCart = useCallback(() => setShow(false), [setShow]);
	const buttonRef = useRef();
	const sectionRef = useRef();
	useEffect(() => {
		if(!sectionRef.current || !buttonRef.current) return;

		const listener = e => {
			if(!clickInsideOf(buttonRef.current, e) && !clickInsideOf(sectionRef.current, e)) {
				// Exclude click events that have detached from dom like removing from cart
				if(!e.target.isConnected) {
					// console.log("Not hiding from external click due to detached node");
					return;
				}
				// console.log("Hiding from external click")
				hideCart();
			}
		}

		document.addEventListener("click", listener);
		return () => document.removeEventListener("click", listener);
	}, [hideCart]);

	return (
		<div className="fixed top-0 left-0 w-full h-full overflow-hidden z-10 pointer-events-none">
			{/* Open Cart Button - Hides by sliding out to the right once clicked */}
			<button
				className={`absolute top-0 left-full w-12 h-12 p-1 bg-slate-200 rounded z-10 pointer-events-auto transition-transform transition-colors hover:bg-slate-300 ${!show ? "-translate-x-full" : "translate-x-0 select-none"}`}
				tabIndex={!show ? 0 : -1}
				aria-hidden={!show}
				onClick={showCart}
				ref={buttonRef}
			>
				<CartIcon/>
				<span className="absolute bottom-1.5 left-0 w-full px-1 text-center">
					<span className="block mx-auto text-center truncate bg-slate-200 bg-opacity-50 text-overflow-plus select-none">
						{numCartItems}
					</span>
				</span>
			</button>

			{/* Cart Sidebar - Shows by sliding in from the right once toggled */}
			<section
				className={`absolute top-0 left-full w-full xs:w-[380px] max-w-full h-full flex flex-col bg-slate-100 z-10 transition-transform pointer-events-auto ${show ? "duration-500 ease-out -translate-x-full" : "duration-200 ease-linear translate-x-0 select-none"}`}
				aria-hidden={!show}
				ref={sectionRef}
			>
				<span className="inline-flex flex-row justify-start items-center w-full h-12 bg-slate-200 border-slate-200 border-b-2">
					<button
						className="w-12 h-12 p-1 border-r-2 border-slate-300 transition-colors hover:bg-slate-300 rounded"
						onClick={hideCart}
						tabIndex={show ? 0 : -1}
					>
						<ChevronRight/>
					</button>
					<h2 className="text-2xl w-fit px-4 relative top-1">
						Your Cart
						{/* Cover Text From Normal Selection */}
						<span className="absolute top-0 left-0 w-full h-full"/>
					</h2>
				</span>
				<div
					className="w-full px-1.5 pt-3 pb-6 border-l border-slate-200 flex flex-grow flex-col overflow-y-auto "
				>
					{cart.items.map(cartItem => (<CartItem item={cartItem.item} count={cartItem.count} key={cartItem.item.item_id}/>))}
				</div>

				<button
					className="w-full px-6 py-3 bg-orange-300 hover:bg-orange-400 transition-colors group"
					onClick={() => console.log("Attempt To Place Order")}
				>
					Place Order <span className="inline-block min-w-6 ml-0.5 px-2 h-6 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors select-none">{numCartItems}</span>
				</button>
			</section>
		</div>
	);
}

/**
 * A single entry in the Cart sidebar
 * @param {Item} item - The item in the Cart
 * @param {number} count - The number of the specified item in the Cart
 * @return {JSX.Element}
 * @constructor
 */
function CartItem({ item, count }) {
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

function CartItemDeleteConfirmation({ show, setShow, onConfirm, itemName }) {
	return (
		<div
			className={`absolute w-full h-full rounded bg-slate-200 flex flex-col justify-between transition-opacity ${show ? "z-20" : "opacity-0 pointer-events-none select-none"}`}
			aria-hidden={!show}
		>
			<div className="mt-2 px-4">
				<h3 className="text-lg text-center leading-tight">Remove {itemName} From Cart?</h3>
			</div>
			<div className="grid grid-rows-1 grid-cols-2 gap-0.5 justify-self-end">
				<button className="py-1 rounded-bl bg-slate-50 transition-[filter] hover:brightness-105" onClick={() => setShow(false)}>Cancel</button>
				<button className="py-1 rounded-br text-slate-50 bg-red-700 transition-[filter] hover:brightness-105" onClick={onConfirm}>Remove</button>
			</div>
		</div>
	);
}