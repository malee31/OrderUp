import { useCart } from "../data-structures/CartData";
import { ReactComponent as ChevronRight } from "../../images/ChevronRight.svg";
import { ReactComponent as CartIcon } from "../../images/Cart.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import clickInsideOf from "../../utilities/clickInsideOf";
import {ReactComponent as MinusIcon} from "../../images/Minus.svg";
import {ReactComponent as PlusIcon} from "../../images/Plus.svg";

export default function Cart({ show, setShow }) {
	const cart = useCart();
	const showCart = useCallback(() => setShow(true), [setShow]);
	const hideCart = useCallback(() => setShow(false), [setShow]);
	const buttonRef = useRef();
	const sectionRef = useRef();
	useEffect(() => {
		if(!sectionRef.current || !buttonRef.current) return;

		const listener = e => {
			if(!clickInsideOf(buttonRef.current, e) && !clickInsideOf(sectionRef.current, e)) {
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
				className={`absolute top-0 left-full w-12 h-12 p-1 bg-slate-200 rounded transition-transform z-10 pointer-events-auto ${!show ? "-translate-x-full" : "translate-x-0"}`}
				tabIndex={!show ? 0 : -1}
				aria-hidden={!show}
				onClick={showCart}
				ref={buttonRef}
			>
				<CartIcon/>
				<span className="absolute bottom-1.5 left-0 w-full px-1 text-center">
					<span className="block mx-auto text-center truncate bg-slate-200 bg-opacity-50 text-overflow-plus">
						{cart.items.reduce((prev, curr) => prev + curr.count, 0)}
					</span>
				</span>
			</button>

			{/* Cart Sidebar - Shows by sliding in from the right once toggled */}
			<section
				className={`absolute top-0 left-full w-full xs:w-[380px] max-w-full h-full flex flex-col bg-slate-100 z-10 transition-transform pointer-events-auto ${show ? "duration-500 ease-out -translate-x-full" : "duration-200 ease-linear translate-x-0"}`}
				aria-hidden={show}
				ref={sectionRef}
			>
				<span className="inline-flex flex-row justify-start items-center w-full h-12 bg-slate-200 border-slate-200 border-b-2">
					<button
						className="w-12 h-12 p-1 mr-4 my-2 border-r-2 border-slate-300 rounded"
						onClick={hideCart}
						tabIndex={show ? 0 : -1}
					>
						<ChevronRight/>
					</button>
					<h2 className="text-2xl w-fit relative top-1">
						Your Cart
					</h2>
				</span>
				<div
					className="w-full px-1.5 pt-3 pb-6 border-l border-slate-200 flex flex-grow flex-col overflow-y-auto "
				>
					{cart.items.map(cartItem => (<CartItem item={cartItem.item} count={cartItem.count} key={cartItem.item.item_id}/>))}
				</div>
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
			setCountInputVal(newCount);
		}

		if(newCountVal <= 0) {
			// TODO: Delete item from cart (Confirmation?)
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

	return (
		<div className="w-full px-2 pt-2 pb-3 mb-2 bg-slate-50 rounded grid grid-rows-1 grid-cols-[minmax(0,_1fr)_auto]">
			<h3 className="h-min text-lg mx-2 mb-1 border-b border-slate-200">
				{item.name} x{count}
			</h3>
			<div className="pl-2 flex flex-col justify-center items-center">
				<button
					className="w-6 h-6 rounded-full shadow-md z-10 bg-slate-50 box-content border border-slate-200 hover:bg-slate-100"
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
					onBlur={updateCount}
					value={countInputVal}
				/>
				<button
					className="w-6 h-6 rounded-full shadow-md z-10 bg-orange-200 box-content border border-slate-200 hover:bg-orange-300"
					onClick={() => updateCount(count + 1)}
				>
					<PlusIcon/>
				</button>
			</div>
		</div>
	);
}