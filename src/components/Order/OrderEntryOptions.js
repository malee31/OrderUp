import { useEffect, useRef, useState } from "react";
import { ReactComponent as VerticalEllipsis } from "../../images/VerticalEllipsis.svg";
import clickInsideOf from "../../utilities/clickInsideOf";

export function OrderEntryOptions(props) {
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
			<div className={`${showOptions ? "block" : "hidden"} absolute top-[calc(100%_+_4px)] right-0 min-w-[8rem] w-fit border-2 shadow border-slate-100 rounded-sm bg-slate-50 z-[999]`}>
				{children}
			</div>
		</div>

	)
}

export function OrderEntryOptionButton(props) {
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