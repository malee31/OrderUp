import { memo } from "react";

function OrderEntryList(props) {
	const { order, ...extraProps } = props;
	const items = order.items;

	return (
		<ul className="w-fill px-4 py-2" {...extraProps}>
			{!items.length && <p>No Items</p>}
			{items.map(itemOrder => (
				<li className="mt-1 mb-2 py-0.5" key={itemOrder.item.item_id}>
					<span className="align-top inline-block min-w-[3em] text-center border mr-0.5">{itemOrder.count}</span>
					<span> </span>
					<span className="inline-block px-1 border-b">{itemOrder.item.name}</span>
				</li>
			))}
		</ul>
	);
}

export default memo(OrderEntryList);