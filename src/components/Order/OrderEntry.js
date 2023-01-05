import { useEffect, useRef, useState } from "react";
import CustomDropdown, { CustomOption } from "../CustomParts/CustomDropdown";
import { ReactComponent as VerticalEllipsis } from "../../images/VerticalEllipsis.svg";
import clickInsideOf from "../../utilities/clickInsideOf";

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
		console.log("TODO: Implement Delete");
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

			<OrderEntryList order={order} edit={editMode} setEdit={setEditMode}/>
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
			className={`w-7 h-full align-middle relative rounded ${className}`}
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
			className={`text-left block w-full px-2 py-1 first:rounded-t-sm last:rounded-b-sm hover:bg-slate-100 focus-visible:bg-slate-100 ${className}`}
			data-close-options-on-click={closeOptionsOnClick}
			{...extraProps}
		>
			{children}
		</button>
	);
}

function OrderEntryList(props) {
	const { order, edit, setEdit, ...extraProps } = props;
	const orderCopy = { ...order, items: [...order.items] };
	const [editItem, setEditItem] = useState(orderCopy);

	// Resync the editable version each time the order changes or edit mode is exited.
	// Does nothing in edit mode unless order number changes which would be alarming
	// Important: Assumes that the order number doesn't change, especially while in edit mode otherwise spazzing will happen
	if(orderCopy.order_number !== editItem.order_number) {
		console.warn(`Warning: This shouldn't happen. List for Order #${editItem.order_number} has changed to #${orderCopy.order_number}`);
		console.warn(`^ Info: Edit mode is ${edit ? "ON so this is impactful" : "OFF so this is invisible"} ^`);
		setEditItem(orderCopy);
	} else if(!edit && !editItem.items.every((editOrderItem, index) => {
		const matchingOrderItem = orderCopy.items[index];
		return matchingOrderItem.count === editOrderItem.count && matchingOrderItem.item.item_id === editOrderItem.item.item_id;
	})) {
		// Check if every item matches. If not everything matches, do nothing unless in edit mode
		// Resync edit item due to changes in the order object in non-edit mode
		// Note: Order swaps still count as a change in the order. This is correct behavior
		console.log(`Resync Editable Order for ${orderCopy.order_number}`)
		setEditItem(orderCopy);
	}

	const onDiscard = () => {
		console.warn(`Discarding Edits For Order #${order.order_number}`);
		setEdit(false);
	};

	const displayedOrder = edit ? editItem : order;
	const items = displayedOrder.items;

	return (
		<>
			<ul className="w-fill px-4 py-2" {...extraProps}>
				{!items.length && <p>No Items</p>}
				{items.map(itemOrder => (
					edit ? (
						<li className="my-0.5" key={itemOrder.item.item_id}>
							<input
								className="inline-block w-0 min-w-[3em] mr-1.5 text-center border input-number-no-spin"
								aria-label={`${itemOrder.item.name} Quantity`}
								value={itemOrder.count}
								type="number"
							/>
							<CustomDropdown className="px-1 py-1 min-w-[15rem]" heightLimit="11rem" value={itemOrder.item.item_id}>
								<CustomOption value={itemOrder.item.item_id}>{itemOrder.item.name}</CustomOption>
							</CustomDropdown>
						</li>
					) : (
						<li className="mt-1 mb-2 py-0.5" key={itemOrder.item.item_id}>
							<span className="align-top inline-block min-w-[3em] text-center border mr-0.5">{itemOrder.count}</span>
							<span> </span>
							<span className="inline-block px-1 border-b">{itemOrder.item.name}</span>
						</li>
					)
				))}
			</ul>
			{edit && (
				<div className="flex flex-row gap-2 px-4 mb-1">
					<button className="px-3 py-1.5 bg-slate-50 border-2 text-green-600 border-green-600 rounded hover:bg-green-500 focus-visible:bg-green-500 hover:text-white focus-visible:text-white">
						Save Edits
					</button>
					<button
						className="px-3 py-1.5 bg-slate-50 border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white focus-visible:bg-red-600 focus-visible:text-white"
						onClick={onDiscard}
					>
						Discard Edits
					</button>
				</div>
			)}
		</>
	);
}