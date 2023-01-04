import { useEffect, useRef, useState } from "react";
import CustomDropdown, { CustomOption } from "../CustomParts/CustomDropdown";
import { ReactComponent as VerticalEllipsis } from "../../images/VerticalEllipsis.svg";
import clickInsideOf from "../../utilities/clickInsideOf";

/**
 * @typedef {Object} Order - An order that has been placed
 * @property {number} order_number - A unique number for the order
 * @property {boolean} fulfilled - Whether the order has been fulfilled yet
 * @property {Item[]} items - All items in the order
 */

/**
 * Displays a single order entry for a list of orders and allows and handles edits to the item internally
 * @param {Order} order - Order to display in the entry
 * @param {function} syncOrder - Function that takes in an updated Order object and resynchronizes it with the list's state. Does not update on the server (that will be done here)
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
		console.log("TODO: Implement Delete");
	};

	return (
		<div className={`before:absolute before:top-0 before:left-0 before:h-full before:w-2 before:rounded-l ${order.fulfilled ? "before:bg-green-400" : "before:bg-orange-300"} ${synchingFulfill ? "before:animate-pulse" : ""} w-full min-h-[108px] p-2 mb-2 bg-slate-50 rounded relative shadow hover:shadow-md transition-shadow`}>
			<div className="w-full border-b border-slate-200">
				<h3 className="inline px-2 text-lg">
					<span className="inline-block min-w-[80px] max-w-full">Order #{order.order_number}</span>
					<CustomDropdown
						className="mx-2 px-1"
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

			<OrderEntryList order={order} edit={editMode}/>
		</div>
	);
}

function OrderEntryOptions(props) {
	const { className = "", onClick, onBlur, children, ...extraProps } = props;
	const [showOptions, setShowOptions] = useState(false);
	/** @type {React.RefObject<HTMLDivElement>} */
	const optionRef = useRef();

	// Close options when clicked outside
	useEffect(() => {
		if(!optionRef.current || !showOptions) return;

		const listener = e => {
			if(clickInsideOf(optionRef.current, e)) return;
			// Exclude click events that have detached from dom like removing from cart
			if(!e.target.isConnected) {
				// console.log("Not hiding from external click due to detached node");
				return;
			}
			// console.log("Hiding from external click")
			setShowOptions(false);
		};

		document.addEventListener("click", listener);
		return () => document.removeEventListener("click", listener);
	}, [showOptions, setShowOptions]);

	return (
		<div
			className={`w-7 h-full align-middle relative ${className}`}
			onBlur={e => {
				if(e.relatedTarget && optionRef.current.contains(e.relatedTarget)) return;
				setShowOptions(false);
				if(onBlur) onBlur();
			}}
			onClick={e => {
				if(e.target.dataset["closeOptionsOnClick"] === "true") {
					setShowOptions(false);
				}
				if(onClick) onClick(e);
			}}
			ref={optionRef}
			{...extraProps}
		>
			<button
				className="block w-7 h-full align-middle"
				onClick={() => setShowOptions(!showOptions)}
			>
				<VerticalEllipsis/>
			</button>
			<div className={`${showOptions ? "block" : "hidden"} absolute top-[calc(100%_+_4px)] right-0 min-w-[8rem] w-fit border-2 shadow border-slate-100 rounded-sm bg-slate-50`}>
				{children}
			</div>
		</div>

	)
}

function OrderEntryOptionButton(props) {
	const { closeOptionsOnClick = true, className = "", children, ...extraProps } = props;

	return (
		<button
			className={`text-left block w-full px-2 py-1 hover:bg-slate-100 focus-visible:bg-slate-100 ${className}`}
			data-close-options-on-click={closeOptionsOnClick}
			{...extraProps}
		>
			{children}
		</button>
	);
}

function OrderEntryList(props) {
	const { order, edit, ...extraProps } = props;
	const items = order.items;

	return (
		<>
			<ul className="w-fill px-4 py-2" {...extraProps}>
				{!items.length && <p>No Items</p>}
				{items.map(itemOrder => (
					<li key={itemOrder.item.item_id}>
						{edit ? "Editing -" : ""} {itemOrder.count} | {itemOrder.item.name}
					</li>
				))}
			</ul>
			{edit && (
				<div className="flex flex-row gap-2 px-4 mb-1">
					<button className="px-3 py-1.5 bg-slate-50 border-2 text-green-600 border-green-600 rounded hover:bg-green-500 focus-visible:bg-green-500 hover:text-white focus-visible:text-white">
						Save Edits
					</button>
					<button className="px-3 py-1.5 bg-slate-50 border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white focus-visible:bg-red-600 focus-visible:text-white">
						Discard Edits
					</button>
				</div>
			)}
		</>
	);
}