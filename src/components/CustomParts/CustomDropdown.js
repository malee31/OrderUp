import { Children, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ReactComponent as ChevronDown } from "../../images/ChevronDown.svg";

/**
 * @file A nearly self-contained custom Dropdown component written in React.
 * Contains nearly drop-in replacements for <select> and <option> tags.
 * Additional dependencies preventing this file from being self-contained: ChevronDown.svg for the down icon and TailwindCSS
 * @author Marvin Lee
 */

/**
 * @typedef {Object} DropdownContextValue
 * @property {function} set - Updates a slice of the value
 * @property {DropdownValue} val - Values for Dropdown state
 */

/**
 * @typedef {Object} DropdownValue
 * @property {*} label - Value to display as a label for Dropdown
 * @property {*} value - Value of the Dropdown
 * @property {boolean} open - Open state of the Dropdown
 * @property {boolean} contentRef.current Array of all options and their ids, values, and labels
 * @property {boolean} changedRef.current Whether the dropdown value has been changed yet. Once it turns true, onChange will be allowed to fire and default value will stop updating
 */

/** @type {React.Context<DropdownContextValue>} */
const DropdownContext = createContext({
	set: () => {},
	val: {
		label: null,
		value: null,
		open: false,
		contentRef: { current: null },
		changedRef: { current: null }
	}
});

/**
 * Use Dropdown Context Values
 * @return {[DropdownValue, function]}
 */
function useDropdown() {
	const dropdownValue = useContext(DropdownContext);
	return [dropdownValue.val, dropdownValue.set];
}

function generateOptionLabel(optionProps) {
	if(optionProps.label !== undefined) return optionProps.label;
	if(typeof optionProps.children === "string") return optionProps.children;
	if(optionProps.children?.every(child => typeof child === "string")) return optionProps.children.join("");
	if(optionProps.value !== undefined) return optionProps.value.toString();

	return "";
}

function generateOptionIdentity(optionProps) {
	const optionLabel = generateOptionLabel(optionProps);
	const optionValue = optionProps.value ?? optionLabel;

	return {
		id: optionProps.id,
		label: optionLabel,
		value: optionValue
	};
}

/**
 * A drop-in replacement for <select>. Contains all the state stored in the dropdown
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export default function CustomDropdown(props) {
	// Note: Does not resync defaultValue even if changedRef is false due to display label issues
	const { defaultValue, value, children, ...extraProps } = props;
	const changedRef = useRef(false);
	const contentRef = useRef([]);
	// Check all contents
	contentRef.current = Children.map(children, child => generateOptionIdentity(child.props));

	const actualValue = value ?? defaultValue ?? (contentRef.current.length ? contentRef.current[0].value : "");
	const label = contentRef.current.find(optionIdentity => optionIdentity.value === actualValue).label;
	const [dropdownValue, setDropdownValue] = useState({
		value: value,
		label: label,
		open: false,
		contentRef: contentRef,
		changedRef: changedRef
	});

	const actualSetDropdownValue = useCallback(newVal => {
		setDropdownValue(oldVal => ({ ...oldVal, ...newVal }));
	}, [setDropdownValue]);

	/** @type {DropdownContextValueValue} */
	const actualDropdownValue = useMemo(() => ({
		set: actualSetDropdownValue,
		val: dropdownValue
	}), [setDropdownValue, dropdownValue]);


	return (
		<DropdownContext.Provider value={actualDropdownValue}>
			<CustomSelect value={dropdownValue} {...extraProps}>
				{children}
			</CustomSelect>
		</DropdownContext.Provider>
	);
}

/**
 * A visual drop-in replacement for <select>. Used internally by <CustomDropdown>
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 * @internal
 */
function CustomSelect(props) {
	const { className, children, onClick, onBlur, onChange = () => {}, ...extraProps } = props;
	const [dropdownValue, setDropdownValue] = useDropdown();
	// Using a ref to avoid infinite change re-fires from useEffect
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	// Fires onChange handlers
	useEffect(() => {
		if(!dropdownValue.changedRef.current) return;

		console.log("FIRE ONCHANGE");
		onChangeRef.current(dropdownValue.value);
	}, [dropdownValue.value, dropdownValue.changedRef, onChangeRef]);

	return (
		<div
			className={`inline-block h-min leading-[normal] align-middle bg-[field] border border-slate-100 cursor-pointer whitespace-nowrap relative mb-0.5 ${className || ""}`}
			onClick={e => {
				setDropdownValue({ open: !dropdownValue.open });
				if(onClick) onClick(e);
			}}
			onBlur={e => {
				setDropdownValue({ open: false });
				if(onBlur) onBlur(e);
			}}
			tabIndex={0}
			{...extraProps}
		>
			<span className="mr-[1em]">{dropdownValue.label}</span>
			<span className="absolute right-0 inline-flex justify-center items-center w-[1em] h-full pr-0.5 align-middle"><ChevronDown/></span>
			<div className={`min-w-full absolute top-full left-0 bg-[field] border border-slate-100 group ${dropdownValue.open ? "" : "hidden"}`}>
				{children}
			</div>
		</div>
	);
}

/**
 * A drop-in replacement for <option> for <select> that can also be styled normally.
 * Implementation limitations (Deriving an identifier for the option):
 * - Props id, value, and label must be unique together (unless both options acting identically and highlighting when the other is clicked is acceptable)
 * - Label will be derived in the following order: label prop if exists, children prop if it is text, value prop to string if exists, blank string
 * - Value will be derived in the following order: value prop if exists, label prop in the order listed above
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function CustomOption(props) {
	const optionIdentity = generateOptionIdentity(props);

	// Dispose used props from identity
	const unusedProps = { ...props };
	delete unusedProps.label;
	delete unusedProps.value;

	const { className, children, ...extraProps } = unusedProps;
	const [dropdownValue, setDropdownValue] = useDropdown();
	const setToOption = useCallback(() => {
		if(dropdownValue.value === optionIdentity.value && dropdownValue.label === optionIdentity.label) return;

		dropdownValue.changedRef.current = true;
		setDropdownValue({ value: optionIdentity.value, label: optionIdentity.label });
	}, [dropdownValue.changedRef, dropdownValue.value, dropdownValue.label, optionIdentity.value, optionIdentity.label, setDropdownValue]);

	return (
		<div
			className={`block w-full px-2 py-0.5 border border-slate-100 bg-[field] cursor-pointer hover:bg-blue-600 hover:text-white ${className || ""}`}
			onClick={setToOption}
			{...extraProps}
		>
			{children}
		</div>
	);
}