import { useState } from "react";
import CustomDropdown, { CustomOption } from "../../CustomParts/CustomDropdown";
import { OrderEntryOptionButton, OrderEntryOptions } from "../OrderEntryOptions";
import { ReactComponent as PlusIcon } from "../../../images/Plus.svg";
import { useMenu } from "../../data-structures/MenuData";

export default function OrderEntryEditList(props) {
	const { order, syncOrder, setEdit, ...extraProps } = props;
	const menu = useMenu();
	/** @type {Order} */
	const orderCopy = { ...order, items: [...order.items] };
	const [saving, setSaving] = useState(false);
	const [editOrder, setEditOrder] = useState(orderCopy);
	const [newEditItem, setNewEditItem] = useState({ count: 0, item: null });

	const onSave = () => {
		console.log("Saving Edited Order:", editOrder);
		setSaving(true);
		fetch("/order/sync", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(editOrder)
		})
			.then(res => {
				if(res.status !== 200) {
					console.warn(`[HTTP ${res.status}] Unable to sync order with server:`);
					res.text().then(console.warn);
					return;
				}
				res.text().then(console.log);
				syncOrder(editOrder);
				setEdit(false);
			})
			.catch(err => {
				console.warn("Unable to sync order with server:");
				console.error(err);
			})
			.finally(() => setSaving(false));
	};

	const onDiscard = () => {
		console.warn(`Discarding Edits For Order #${order.order_number}`);
		setEdit(false);
	};

	const changeEditItem = (item_id, newEditOrderItem) => {
		const foundItemIndex = editOrder.items.findIndex(editOrderItem => editOrderItem.item.item_id === item_id);
		const editOrderItemsClone = [...editOrder.items];
		// console.log("From:", { ...editOrder, items: [...editOrder.items] })
		if(foundItemIndex === -1) {
			// Add the item
			editOrderItemsClone.push(newEditOrderItem);
		} else {
			editOrderItemsClone.splice(foundItemIndex, 1, newEditOrderItem);
			if(!newEditOrderItem || newEditOrderItem.count === 0) {
				// Delete if count is 0 or editOrder is null
				editOrderItemsClone.splice(foundItemIndex, 1);
			}
		}
		// console.log("To:", { ...editOrder, items: editOrderItemsClone })
		setEditOrder({ ...editOrder, items: editOrderItemsClone });
	};

	const items = editOrder.items;

	return (
		<>
			<ul className="w-fill px-4 py-2" {...extraProps}>
				{!items.length && <p>No Items</p>}
				{items.map(itemOrder => (
					<li className="my-0.5" key={itemOrder.item.item_id}>
						<input
							className="inline-block w-0 min-w-[3em] mr-1.5 text-center border input-number-no-spin"
							aria-label={`${itemOrder.item.name} Quantity`}
							type="number"
							readOnly={saving}
							value={itemOrder.count}
							onChange={e => {
								changeEditItem(itemOrder.item.item_id, {
									...itemOrder,
									count: Math.max(1, Number(e.target.value))
								});
							}}
						/>
						<CustomDropdown
							className="px-1 py-1 min-w-[13.5rem] md:min-w-[15rem]"
							heightLimit="11rem"
							value={itemOrder.item.item_id}
							onChange={newValue => {
								// console.log(`Change Item ${itemOrder.item.item_id} To:`, { ...itemOrder, item: { ...menu.menuItems.find(menuItem => menuItem.item_id === newValue) } })
								changeEditItem(itemOrder.item.item_id, {
									...itemOrder,
									item: { ...menu.menuItems.find(menuItem => menuItem.item_id === newValue) }
								});
							}}
						>
							{menu.loaded ? (
								menu.menuItems.map(menuItem => (
									<CustomOption
										key={menuItem.item_id}
										value={menuItem.item_id}
										disabled={saving || (itemOrder.item.item_id !== menuItem.item_id && Boolean(editOrder.items.find(editOrderItem => editOrderItem.item.item_id === menuItem.item_id)))}
									>
										{menuItem.name}
									</CustomOption>
								))
							) : (
								<CustomOption value={itemOrder.item.item_id} disabled={true}>{itemOrder.item.name}</CustomOption>
							)}
						</CustomDropdown>
						<OrderEntryOptions className="inline-block">
							<OrderEntryOptionButton
								disabled={saving}
								onClick={() => changeEditItem(itemOrder.item.item_id, null)}
							>
								Delete
							</OrderEntryOptionButton>
						</OrderEntryOptions>
					</li>
				))}
				<li className="my-0.5">
					<input
						className="inline-block w-0 min-w-[3em] mr-1.5 text-center border input-number-no-spin"
						aria-label={`${newEditItem?.item?.name || ""} Quantity`.trim()}
						type="number"
						readOnly={saving}
						value={newEditItem.count || ""}
						onChange={e => {
							setNewEditItem({
								...newEditItem,
								count: Math.max(1, Number(e.target.value))
							});
						}}
					/>
					<CustomDropdown
						className="px-1 py-1 min-w-[13.5rem] md:min-w-[15rem]"
						heightLimit="11rem"
						value={newEditItem?.item?.item_id ?? ""}
						onChange={newValue => {
							if(typeof newValue !== "number") return;
							// console.log(`Change Item ${itemOrder.item.item_id} To:`, { ...itemOrder, item: { ...menu.menuItems.find(menuItem => menuItem.item_id === newValue) } })
							setNewEditItem({
								...newEditItem,
								item: { ...menu.menuItems.find(menuItem => menuItem.item_id === newValue) }
							});
						}}
					>
						<CustomOption
							label=""
							value=""
						>
							No Item Selected
						</CustomOption>
						{menu.loaded ? (
							menu.menuItems.map(menuItem => (
								<CustomOption
									key={menuItem.item_id}
									value={menuItem.item_id}
									disabled={saving || ((!newEditItem.item || newEditItem.item.item_id !== menuItem.item_id) && Boolean(editOrder.items.find(editOrderItem => editOrderItem.item.item_id === menuItem.item_id)))}
								>
									{menuItem.name}
								</CustomOption>
							))
						) : (
							<CustomOption value={newEditItem.item?.item_id} disabled={true}>{newEditItem.item?.name}</CustomOption>
						)}
					</CustomDropdown>
					<button
						className="inline-block w-7 h-full align-middle rounded"
						onClick={() => {
							if(newEditItem.count === 0 || !newEditItem.item) return;
							setEditOrder({ ...editOrder, items: [...editOrder.items, newEditItem] });
							setNewEditItem({ count: 0, item: null });
						}}
					>
						<PlusIcon/>
					</button>
				</li>
			</ul>
			<div className="flex flex-row gap-2 px-4 mb-1">
				<button
					className="px-3 py-1.5 bg-slate-50 border-2 text-green-600 border-green-600 rounded hover:bg-green-500 focus-visible:bg-green-500 hover:text-white focus-visible:text-white disabled:grayscale"
					disabled={saving}
					onClick={onSave}
				>
					Save Edits
				</button>
				<button
					className="px-3 py-1.5 bg-slate-50 border-2 border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white focus-visible:bg-red-600 focus-visible:text-white disabled:grayscale"
					disabled={saving}
					onClick={onDiscard}
				>
					Discard Edits
				</button>
			</div>
			{saving && (<p role="alert" className="px-4 text-sm text-slate-500">Saving...</p>)}
		</>
	);
}