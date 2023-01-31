export default function CartItemDeleteConfirmation({ show, setShow, onConfirm, itemName }) {
	return (
		<div
			className={`absolute w-full h-full rounded bg-slate-200 flex flex-col justify-between transition-opacity ${show ? "z-20" : "opacity-0 pointer-events-none select-none"}`}
			aria-hidden={!show}
		>
			<div className="mt-2 px-4">
				<h3 className="text-lg text-center leading-tight">Remove {itemName} From Cart?</h3>
			</div>
			<div className="grid grid-rows-1 grid-cols-2 gap-0.5 justify-self-end">
				<button
					className="py-1 rounded-bl bg-slate-50 transition-[filter] hover:brightness-105"
					onClick={() => setShow(false)}
					tabIndex={show ? 0 : -1}
				>
					Cancel
				</button>
				<button
					className="py-1 rounded-br text-slate-50 bg-red-700 transition-[filter] hover:brightness-105"
					onClick={onConfirm}
					tabIndex={show ? 0 : -1}
				>
					Remove
				</button>
			</div>
		</div>
	);
}