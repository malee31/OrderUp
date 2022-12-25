import { useCart } from "../data-structures/CartData";
import { ReactComponent as ChevronRight } from "../../images/ChevronRight.svg";
import { ReactComponent as CartIcon } from "../../images/Cart.svg";
import { useCallback, useEffect, useRef } from "react";
import clickInsideOf from "../../utilities/clickInsideOf";

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
				tabIndex={show ? 0 : -1}
				aria-hidden={show}
				ref={sectionRef}
			>
				<span className="inline-flex flex-row justify-start items-center w-full h-12 bg-slate-200 border-slate-200 border-b-2">
					<button
						className="w-12 h-12 p-1 mr-4 my-2 border-r-2 border-slate-300 rounded"
						onClick={hideCart}
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

function CartItem({ item, count }) {
	return (
		<div className="w-full px-4 pt-2 pb-3 mb-2 bg-slate-50 rounded">
			<h3 className="text-lg mb-1 border-b border-slate-200">
				{item.name} x{count}
			</h3>
			<p>{item.description}</p>
		</div>
	);
}