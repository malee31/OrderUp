import { useState } from "react";
import CustomDropdown, { CustomOption } from "../CustomParts/CustomDropdown";
import OrderEntryList from "./OrderEntryList";
import OrderEntryEditList from "./EntryEdit/OrderEntryEditList";
import { OrderEntryOptionButton, OrderEntryOptions } from "./OrderEntryOptions";

/**
 * @typedef {Object} OrderItem - An item in the order
 * @property {MenuItem} item - The item in the order
 * @property {number} count - Number of the item in the order
 */

/**
 * @typedef {Object} Order - An order that has been placed
 * @property {number} order_number - A unique number for the order
 * @property {boolean} fulfilled - Whether the order has been fulfilled yet
 * @property {OrderItem[]} items - All items in the order
 */

/**
 * Displays a single order entry for a list of orders and allows and handles edits to the item internally
 * @param {Order} order - Order to display in the entry
 * @param {function} syncOrder - Function that takes in an updated Order object and resynchronizes it with the list's state. If given a falsy value followed by an order number, the order will be deleted instead. Does not update on the server (that will be done here)
 * @return {JSX.Element}
 * @constructor
 */
export default function OrderEntry({ order, syncOrder }) {
	const [synchingFulfill, setSynchingFulfill] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const changeFulfillmentStatus = newFulfillState => {
		// console.log(`Fulfillment State Changing to [${newFulfillState}]`);
		setSynchingFulfill(true);
		const orderCopy = {
			...order,
			fulfilled: newFulfillState
		};

		fetch(`/order/fulfill/change/${order.order_number}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(orderCopy)
		})
			.then(res => {
				if(res.status !== 200) {
					console.warn(`[HTTP ${res.status}] Unable To Change Fulfillment Status For Order ${orderCopy.order_number} to ${orderCopy.fulfilled}`);
					return;
				}
				syncOrder(orderCopy);
				return res.text().then(console.log);
			})
			.catch(err => {
				console.warn(`Unable To Change Fulfillment Status For Order ${orderCopy.order_number} to ${orderCopy.fulfilled}`);
				console.error(err);
			})
			.finally(() => setSynchingFulfill(false));
	};

	const deleteEntry = () => {
		fetch(`/order/delete/${order.order_number}`, {
			method: "POST"
		}).then(res => {
			if(res.status !== 200) {
				console.warn(`Unable To Delete Order #${order.order_number}`);
				console.log(res);
				return;
			}
			res.text().then(console.warn);
			syncOrder(null, order.order_number);
		});
	};

	return (
		<div className={`before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:rounded-l ${order.fulfilled ? "before:bg-green-400" : "before:bg-orange-300"} ${synchingFulfill ? "before:animate-pulse" : ""} w-full min-h-[108px] p-2 mb-2 bg-slate-50 rounded relative shadow hover:shadow-md transition-shadow`}>
			<div className="w-full border-b border-slate-200">
				<h3 className="inline px-2 text-lg">
					<span className="inline-block min-w-[80px] max-w-full">Order #{order.order_number}</span>
					<CustomDropdown
						className="mx-2 px-1 z-10"
						value={order.fulfilled}
						onChange={val => {changeFulfillmentStatus(val)}}
					>
						<CustomOption value={true}>Fulfilled</CustomOption>
						<CustomOption value={false}>Ongoing</CustomOption>
					</CustomDropdown>
				</h3>

				<OrderEntryOptions className="float-right">
					<OrderEntryOptionButton onClick={() => setEditMode(true)}>
						Edit
					</OrderEntryOptionButton>
					{/* Double focus class for CSS precedence */}
					<OrderEntryOptionButton
						className="hover:bg-red-600 hover:text-white focus-visible:focus-visible:bg-red-600 focus-visible:text-white"
						onClick={deleteEntry}
					>
						Delete
					</OrderEntryOptionButton>
				</OrderEntryOptions>
			</div>

			{!editMode ? (
				<OrderEntryList order={order}/>
			) : (
				<OrderEntryEditList order={order} syncOrder={syncOrder} setEdit={setEditMode}/>
			)}
		</div>
	);
}