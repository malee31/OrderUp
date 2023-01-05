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
 * @property {Object[]} contentRef.current Array of all options and their ids, values, and labels
 * @property {Object} selectedIdentityRef.current Identity entry from contentRef for the currently selected item
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
		selectedIdentityRef: { current: null },
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

function primitiveToString(inputVal) {
	const inputType = typeof inputVal;
	if(inputType === "string" || inputType === "number" || inputType === "boolean") return inputVal.toString();
	return undefined;
}

function generateOptionLabel(optionProps) {
	if(optionProps.label !== undefined) return optionProps.label;
	if(typeof primitiveToString(optionProps.children) === "string") return primitiveToString(optionProps.children);
	if(optionProps.children?.every(child => typeof primitiveToString(child) === "string")) return optionProps.children.join("");
	if(optionProps.value !== undefined) return optionProps.value.toString();

	return "";
}

function generateOptionIdentity(optionProps) {
	const optionLabel = generateOptionLabel(optionProps);
	const optionValue = optionProps.value ?? optionLabel;

	return {
		id: optionProps.id,
		label: optionLabel,
		value: optionValue,
		selected: optionProps.selected
	};
}

function optionIdentityMatch(identityA, identityB) {
	if(identityA.value !== identityB.value) return false;
	if(identityA.label !== identityB.label) return false;
	return identityA.id === identityB.id;
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
	const selectedIdentityRef = useRef({});
	// Generate all contents as an array of identities
	contentRef.current = Children.map(children, child => generateOptionIdentity(child.props));

	const actualValue = value ?? defaultValue ?? (contentRef.current.length ? contentRef.current[0].value : "");
	selectedIdentityRef.current = contentRef.current.find(optionIdentity => optionIdentity.value === actualValue);
	const label = selectedIdentityRef.current.label;
	const [dropdownValue, setDropdownValue] = useState({
		value: value,
		label: label,
		open: false,
		contentRef: contentRef,
		selectedIdentityRef: selectedIdentityRef,
		changedRef: changedRef
	});

	/** @type {function} */
	const actualSetDropdownValue = useCallback(newVal => {
		setDropdownValue(oldVal => ({ ...oldVal, ...newVal }));
	}, [setDropdownValue]);

	/** @type {DropdownContextValue} */
	const actualDropdownValue = useMemo(() => ({
		set: actualSetDropdownValue,
		val: dropdownValue
	}), [actualSetDropdownValue, dropdownValue]);

	return (
		<DropdownContext.Provider value={actualDropdownValue}>
			<CustomSelect {...extraProps}>
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
	const { className, children, onClick, onBlur, heightLimit, onChange = () => {}, ...extraProps } = props;
	const [dropdownValue, setDropdownValue] = useDropdown();
	const selectRef = useRef();
	// Small negligible chance of collision
	const ariaIdRef = useRef(`aria-id-${Date.now()}-${Math.random().toString(16).slice(2)}`);
	// Using a ref to avoid infinite change re-fires from useEffect
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	// Fires onChange handlers
	useEffect(() => {
		if(!dropdownValue.changedRef.current) return;

		onChangeRef.current(dropdownValue.value);
	}, [dropdownValue.value, dropdownValue.changedRef, onChangeRef]);

	return (
		<div
			className={`inline-block h-min leading-[normal] align-middle bg-[field] border border-slate-100 cursor-pointer select-none whitespace-nowrap relative mb-0.5 ${className || ""}`}
			onClick={e => {
				setDropdownValue({ open: !dropdownValue.open });
				if(onClick) onClick(e);
			}}
			onBlur={e => {
				if(!e.relatedTarget || !selectRef.current || !selectRef.current.contains(e.relatedTarget)) {
					setDropdownValue({ open: false });
				}

				if(onBlur) onBlur(e);
			}}
			onKeyDown={e => {
				if(e.key !== " " || e.target !== selectRef.current) return;
				setDropdownValue({ open: true });
			}}
			role="combobox"
			aria-expanded={dropdownValue.open}
			aria-controls={ariaIdRef.current}
			tabIndex={0}
			ref={selectRef}
			{...extraProps}
		>
			<div className="sticky top-0">
				<span className="mr-[1em]">{dropdownValue.label}</span>
				<span className="absolute top-0 right-0 inline-flex justify-center items-center w-[1em] h-full pr-0.5 align-middle"><ChevronDown/></span>
			</div>
			<div
				className={`min-w-full absolute top-full left-0 bg-[field] border border-slate-100 group overflow-y-auto z-[999] ${dropdownValue.open ? "" : "hidden"}`}
				style={heightLimit !== undefined ? { maxHeight: heightLimit } : {}}
				role="listbox"
				id={ariaIdRef.current}
			>
				{children}
			</div>
		</div>
	);
}

/**
 * A drop-in replacement for <option> for <select> that can also be styled normally.
 * Implementation limitations:
 * - Multi-select is not supported
 * - Opt-groups are not supported
 * - Prop selected is not supported. Use the value prop on the dropdown instead
 * - Dropdown reverting to first option when the option is selected but deleted is not supported
 * - Deriving an identifier for the option
 *   - Props id, value, and label must be unique together (unless both options acting identically and highlighting when the other is clicked is acceptable)
 *   - Label will be derived in the following order: label prop if exists, children prop if it is text, value prop to string if exists, blank string
 *   - Value will be derived in the following order: value prop if exists, label prop in the order listed above
 * @param {Object} props
 * @return {JSX.Element}
 * @constructor
 */
export function CustomOption(props) {
	const [dropdownValue, setDropdownValue] = useDropdown();
	const optionIdentity = generateOptionIdentity(props);

	// Reconstructing the optionIdentity object without a spread operator (A bit messy)
	const memoOptionIdentity = useMemo(() => {
		return {
			id: optionIdentity.id,
			value: optionIdentity.value,
			label: optionIdentity.label,
			selected: optionIdentity.selected,
		};
	}, [optionIdentity.id, optionIdentity.label, optionIdentity.value, optionIdentity.selected]);

	// For identifying when the option's label or value changes
	const [identity, setIdentity] = useState(memoOptionIdentity);
	const selected = optionIdentityMatch(identity, dropdownValue.selectedIdentityRef.current);
	useEffect(() => {
		// Only act if identity has changed
		if(optionIdentityMatch(identity, memoOptionIdentity)) return;

		// If Old value matches current dropdown value
		if(dropdownValue.value === identity.value) {
			// console.log("Identity - Value Update");
			setDropdownValue({
				label: memoOptionIdentity.label,
				value: memoOptionIdentity.value
			});
		}

		// Update identity for future diffs
		setIdentity(memoOptionIdentity);
	}, [identity, memoOptionIdentity, dropdownValue.value, setDropdownValue]);

	// Dispose used props from identity
	const unusedProps = { ...props };
	delete unusedProps.label;
	delete unusedProps.value;

	const { className, children, ...extraProps } = unusedProps;
	const setToOption = () => {
		if(dropdownValue.value === optionIdentity.value && dropdownValue.label === optionIdentity.label) return;

		dropdownValue.changedRef.current = true;
		dropdownValue.selectedIdentityRef.current = optionIdentity;
		setDropdownValue({ value: optionIdentity.value, label: optionIdentity.label, open: false });
	};

	return (
		<div
			className={`block w-full px-2 py-0.5 border border-slate-100 bg-[field] cursor-pointer hover:bg-blue-600 hover:text-white ${className || ""}`}
			onClick={setToOption}
			onKeyDown={e => {
				if(e.key !== "Enter" && e.key !== " ") return;
				setToOption();
				e.target.blur();
			}}
			role="option"
			aria-selected={selected}
			tabIndex={0}
			{...extraProps}
		>
			{children}
		</div>
	);
}