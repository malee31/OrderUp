import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ReactComponent as ChevronDown } from "../../images/ChevronDown.svg";

/**
 * @typedef {Object} DropdownValue
 * @property {function} set - Updates a slice of the value
 * @property {Object} val - Values for Dropdown state
 * @property {*} val.display - Value to display for Dropdown
 * @property {*} val.value - Value of the Dropdown
 * @property {boolean} val.open - Open state of the Dropdown
 * @property {boolean} changedRef.current Whether the dropdown value has been changed yet. Once it turns true, onChange will be allowed to fire and default value will stop updating
 */
const DropdownContext = createContext({
	set: () => {},
	val: {
		display: null,
		value: null,
		open: false,
		changedRef: { current: null }
	}
});

/**
 * Use Dropdown Context Values
 * @return {[Object, function]}
 */
function useDropdown() {
	const dropdownValue = useContext(DropdownContext);
	return [dropdownValue.val, dropdownValue.set];
}

export default function CustomDropdown(props) {
	// Note: Does not resync defaultValue even if changedRef is false due to display issues
	const { defaultValue, value, children, onChange = () => {}, ...extraProps } = props;
	const changedRef = useRef(false);
	const [dropdownValue, setDropdownValue] = useState({ value: defaultValue ?? value ?? 0, display: value, open: false, changedRef: changedRef });
	/** @type {DropdownValue} */
	const actualDropdownValue = useMemo(() => ({
		set: newVal => setDropdownValue(oldVal => ({ ...oldVal, ...newVal })),
		val: dropdownValue
	}), [setDropdownValue, dropdownValue]);

	useEffect(() => {
		if(value !== dropdownValue.value) actualDropdownValue.set({ value: value, display: value });
	}, [value]);

	useEffect(() => {
		if(dropdownValue.changedRef.current) {
			onChange(dropdownValue.value);
		}
	}, [dropdownValue.value, dropdownValue.changedRef]);

	return (
		<DropdownContext.Provider value={actualDropdownValue}>
			<CustomSelect value={dropdownValue} {...extraProps}>
				{children}
			</CustomSelect>
		</DropdownContext.Provider>
	);
}

function CustomSelect(props) {
	const { className, children, ...extraProps } = props;
	const [dropdownValue, setDropdownValue] = useDropdown();

	return (
		<div
			className={`inline-block h-min leading-[normal] align-middle bg-[field] border border-slate-100 cursor-pointer whitespace-nowrap relative mb-0.5 ${className || ""}`}
			onClick={() => setDropdownValue({ open: !dropdownValue.open })}
			onBlur={() => setDropdownValue({ open: false })}
			tabIndex={0}
			{...extraProps}
		>
			<span className="mr-[1em]">{dropdownValue.display}</span>
			<span className="absolute right-0 inline-flex justify-center items-center w-[1em] h-full pr-0.5 align-middle"><ChevronDown/></span>
			<div className={`min-w-full absolute top-full left-0 bg-[field] border border-slate-100 group ${dropdownValue.open ? "" : "hidden"}`}>
				{children}
			</div>
		</div>
	);
}

export function CustomOption(props) {
	const { className, value, children, ...extraProps } = props;
	const [dropdownValue, setDropdownValue] = useDropdown();
	const display = typeof children === "string" ? children : value;
	const setToOption = () => setDropdownValue({ value: value, display: display });

	// Set initial display value (Note: Results in a 1 render delay)
	useEffect(() => {
		if(dropdownValue.value === value && dropdownValue.display !== display) {
			setToOption();
		}
	}, [dropdownValue.value]);

	return (
		<div
			className={`block w-full px-2 py-0.5 border border-slate-100 bg-[field] cursor-pointer hover:bg-blue-600 hover:text-white ${className || ""}`}
			onClick={() => {
				dropdownValue.changedRef.current = true;
				setToOption();
			}}
			{...extraProps}
		>
			{children}
		</div>
	);
}