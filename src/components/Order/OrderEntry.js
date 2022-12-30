export default function OrderEntry({order}) {
	return (
		<div className="w-full min-h-[108px] px-4 py-2 mb-2 bg-slate-50 rounded relative shadow hover:shadow-md transition-shadow">
			<h3 className="text-lg border-b border-slate-200">Order #{order.order_number} ({order.fulfilled ? "Fulfilled" : "Ongoing"})</h3>
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