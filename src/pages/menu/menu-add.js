export default function MenuAdd() {
	return (
		<main className="w-full h-full px-8 py-8 overflow-y-auto bg-gray-100 relative">
			<h1 className="text-center text-3xl">
				Add An Item To The Menu
			</h1>
			<h2 className="text-center text-lg text-gray-500">
				Add new items for our patrons to enjoy
			</h2>
			<hr className="mt-2 mb-4"/>
			<MenuItemForm/>
		</main>
	);
}

function MenuItemForm() {
	const submit = e => {
		e.preventDefault();
		console.log(e)
		const formData = new FormData(e.target);
		const newItem = {
			name: formData.get("item-name"),
			description: formData.get("item-desc")
		};
		console.log("Add New Item:");
		console.log(newItem);
		fetch("/menu/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newItem)
		})
			.then(res => res.text())
			.then(console.log)
			.catch(err => {
				console.warn("Unable To Add New Menu Item:");
				console.error(err);
			});
	}

	return (
		<form
			className="w-full max-w-[1000px] p-4 mx-auto my-4 rounded-md shadow-md bg-slate-50 border-transparent border-2 transition-[box-shadow,background-color] hover:shadow-lg hover:bg-white"
			onSubmit={submit}
		>
			<h3 className="text-center text-xl">Add An Item</h3>
			<hr className="mt-2 mb-4"/>
			<label className="block">
				<span className="block text-lg">Item Name</span>
				<input
					className="w-[360px] max-w-full px-2 py-1 border-2 rounded-md"
					name="item-name"
				/>
			</label>
			<label className="block">
				<span className="block text-lg">Item Description</span>
				<input
					className="w-[360px] max-w-full px-2 py-1 border-2 rounded-md"
					name="item-desc"
				/>
			</label>
			<button
				className="block text-lg px-3 py-1.5 mt-2 border-2 bg-orange-200 transition-colors hover:bg-orange-300 rounded shadow-md"
				type="submit"
			>
				Add Item
			</button>
		</form>
	);
}
