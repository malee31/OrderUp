import { useCart } from "../data-structures/CartData";

export default function MenuItem({ name, item_id, description }) {
	const cart = useCart();

	return (
		<div className="w-full max-w-[1000px] px-4 py-2 mx-auto my-4 rounded-md shadow-md bg-slate-50 border-transparent border-2 transition-[box-shadow,background-color] hover:shadow-lg hover:bg-white">
			<h3 className="text-xl">{name}</h3>
			<hr/>
			<div className="w-100 min-h-[4rem] p-1 relative">
				<p className="inline-block">
					{description}

					{/* Used as a spacer for the actual "Add to Cart" button below */}
					<span
						className="invisible inline-block align-text-top mb-1 px-2 py-1"
						aria-hidden={true}
					>
						Add to Cart
					</span>
				</p>
				<button
					className="px-2 py-1 absolute bottom-0 right-0 bg-orange-300 rounded select-none transition-[box-shadow] hover:shadow-md"
					onClick={() => cart.addItem({
						item_id: item_id,
						name: name,
						description: description
					})}
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
}