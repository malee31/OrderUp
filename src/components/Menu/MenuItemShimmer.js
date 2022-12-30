import { useRef } from "react";

export default function MenuItemShimmer() {
	const numFullSpanLines = useRef(Array(Math.floor(Math.random() * 2)).fill("Loading..."));
	const numRepeatLoadSpan = useRef(Array(Math.floor(Math.random() * 5 + (4 - 2 * numFullSpanLines.current.length))).fill("Loading..."));
	const titleWidth = useRef(Math.floor(Math.random() * 40 + 20));

	// Note: Render methods use indices as keys intentionally to silence the warning because the order does not matter and the state will not change
	return (
		<div
			aria-busy={true}
			aria-hidden={true}
			className="w-full max-w-[1000px] px-4 py-2 mx-auto my-4 rounded-md shadow-md bg-slate-50 border-transparent border-2 transition-[box-shadow,background-color] select-none"
		>
			<h3 className="animate-pulse bg-slate-200 text-transparent mb-1 text-xl" style={{width: `${titleWidth.current}%`}}>Loading...</h3>
			<div className="w-100 min-h-[4rem] p-1 relative">
				<p className="inline-block w-full">
					{numFullSpanLines.current.map((text, index) => (
						<span key={index} className="animate-pulse bg-slate-200 text-transparent mb-0.5 inline-block w-full">{text}</span>
					))}
					<span className="animate-pulse bg-slate-200 text-transparent mb-0.5 inline-block">{numRepeatLoadSpan.current.join(" ")}</span>

					{/* Used as a spacer for the actual "Add to Cart" button below */}
					<span
						className="invisible inline-block align-text-top mb-1 px-2 py-1"
						aria-hidden={true}
					>
						Add to Cart
					</span>
				</p>
				<button className="animate-pulse text-transparent px-2 py-1 absolute bottom-0 right-0 bg-orange-300 rounded">
					Add to Cart
				</button>
			</div>
		</div>
	);
}