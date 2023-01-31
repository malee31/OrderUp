import { useCart } from "../data-structures/CartData";
import { ReactComponent as LoadIcon } from "../../images/Load.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlaceOrderButton({ show, numCartItems }) {
	const cart = useCart();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const placeOrder = () => {
		setLoading(true);
		console.log("Attempting To Place An Order");
		fetch(`/cart/place/${cart.cartId}`)
			.then(res => {
				console.log(res.status);
				if(res.status === 200) {
					console.log("Order Placed");
					cart.updateCart({ items: [] });
				} else {
					console.warn(`Failed To Place Order [Status: ${res.status}]`);
				}
				setLoading(false);
				navigate("/orders");
			})
			.catch(err => {
				console.warn("Unable To Place An Order:");
				console.error(err);
			});
	};

	return (
		<button
			className={`w-full px-6 py-3 bg-orange-300 transition-colors group ${loading ? "cursor-default" : "hover:bg-orange-400 cursor-pointer"}`}
			disabled={loading}
			tabIndex={show ? 0 : -1}
			onClick={placeOrder}
		>
			Place Order
			{loading ? (
				<span className="inline-block w-5 h-5 mx-1 animate-spin origin-center align-text-top"><LoadIcon/></span>
			) : (
				<span className="inline-block min-w-6 ml-0.5 px-2 h-6 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors select-none">{numCartItems}</span>
			)}
		</button>
	);
}