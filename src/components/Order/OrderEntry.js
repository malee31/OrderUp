import CustomDropdown, { CustomOption } from "../CustomParts/CustomDropdown";
import { useState } from "react";

export default function OrderEntry({ order }) {
	// TODO: Change fulfillment status
	const [synchingFulfill, setSynchingFulfill] = useState(false);

	return (
		<div className={`before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:rounded-l ${order.fulfilled ? "before:bg-green-400" : "before:bg-orange-300"} ${synchingFulfill ? "before:animate-pulse" : ""} w-full min-h-[108px] px-4 py-2 mb-2 bg-slate-50 rounded relative shadow hover:shadow-md transition-shadow`}>
			<h3 className="text-lg border-b border-slate-200">
				<span className="inline-block min-w-[80px] max-w-full">Order #{order.order_number}</span>
				<CustomDropdown
					className="mx-2 px-1"
					value={order.fulfilled}
					onChange={val => {
						console.log(`Dropdown set to [${val}]`);
					}}
				>
					<CustomOption value={true}>Fulfilled</CustomOption>
					<CustomOption value={false}>Ongoing</CustomOption>
				</CustomDropdown>
			</h3>
			<ul className="w-fill p-2">
				{!order.items.length && <p>No Items</p>}
				{order.items.map(itemOrder => (
					<li key={itemOrder.item.item_id}>
						{itemOrder.count} | {itemOrder.item.name}
					</li>
				))}
			</ul>
		</div>
	);
}