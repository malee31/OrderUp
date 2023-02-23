import CartItem from "./CartItem";
import PlaceOrderButton from "./PlaceOrderButton";
import { useCart } from "../data-structures/CartData";
import { ReactComponent as CartIcon } from "../../images/Cart.svg";
import { ReactComponent as ChevronRight } from "../../images/ChevronRight.svg";

export default function CartSidebar() {
	const cart = useCart();

	return (
		<div
			className="fixed top-0 left-0 w-full h-full overflow-hidden z-30 pointer-events-none"
		>
			<div
				className={`absolute top-0 left-0 w-full h-full pointer-events-auto bg-transparent transition-colors ${cart.open ? "block opacity-25 duration-500 fade-in bg-slate-400" : "hidden"}`}
				onClick={() => cart.setOpen(false)}
			/>

			{/* Cart Sidebar - Shows by sliding in from the right once toggled */}
			<CartSidebarSection show={cart.open} closeCart={() => cart.setOpen(false)}/>
		</div>
	);
}

function CartButton({ show, onClick }) {
	const cart = useCart();
	const numCartItems = cart.items.reduce((prev, curr) => prev + curr.count, 0);

	return (
		<button
			className={`absolute bottom-8 right-0 w-16 h-16 p-1 bg-slate-200 rounded-l z-10 pointer-events-auto transition-transform transition-colors hover:bg-slate-300 ${!show ? "translate-x-full" : "translate-x-0 select-none"}`}
			tabIndex={show ? 0 : -1}
			aria-hidden={!show}
			title="Your Cart"
			onClick={onClick}
		>
			<CartIcon/>
			<span className="absolute bottom-3 left-0 w-full px-1 text-center">
					<span className="block mx-auto text-center truncate bg-slate-200 bg-opacity-50 text-overflow-plus select-none">
						{numCartItems}
					</span>
				</span>
		</button>
	);
}

function CartSidebarSection({ show, closeCart }) {
	const cart = useCart();
	const numCartItems = cart.items.reduce((prev, curr) => prev + curr.count, 0);

	return (
		<section
			className={`absolute top-0 left-full w-full xs:w-[380px] max-w-full h-full flex flex-col bg-slate-100 z-10 transition-transform pointer-events-auto ${show ? "duration-500 ease-out -translate-x-full" : "duration-200 ease-linear translate-x-0 select-none"}`}
			aria-hidden={!show}
		>
				<span className="inline-flex flex-row justify-start items-center w-full h-12 bg-slate-200 border-slate-200 border-b-2">
					<button
						className="w-12 h-12 p-1 border-r-2 border-slate-300 transition-colors hover:bg-slate-300 rounded"
						onClick={closeCart}
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
				{cart.items.map(cartItem => (<CartItem show={show} item={cartItem.item} count={cartItem.count} key={cartItem.item.item_id}/>))}
			</div>

			<PlaceOrderButton show={show} numCartItems={numCartItems}/>
		</section>
	);
}