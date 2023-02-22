import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoIcon from "../images/logo.svg";
import { ReactComponent as TripleBars } from "../images/TripleBars.svg";
import { ReactComponent as CartIcon } from "../images/Cart.svg";
import clickInsideOf from "../utilities/clickInsideOf";
import { useCart } from "./data-structures/CartData";

export default function Nav() {
	const location = useLocation();
	const showCartIcon = location.pathname === "/menu" || location.pathname === "/menu/";

	return (
		<nav className="absolute top-0 w-full h-16 pl-2 pr-4 flex flex-row items-center bg-orange-300 z-20">
			<div className="h-full aspect-square p-2 z-50">
				<Link
					to="/home"
					className="block h-full aspect-square rounded bg-orange-50"
				>
					<img className="w-full h-full" src={logoIcon} alt="OrderUp"/>
				</Link>
			</div>

			<DesktopNavLinks showCartIcon={showCartIcon}/>
			<MobileNav showCartIcon={showCartIcon}/>
		</nav>
	);
}

function DesktopNavLinks({ showCartIcon = false }) {
	return (
		<div className="hidden sm:flex w-full h-full py-2 flex flex-row gap-2 items-center overflow-x-auto">
			<AllNavLinks/>

			{showCartIcon && (
				<button
					onClick={() => console.log("TODO: Open Cart Sidebar")}
					className="absolute right-2 w-12 h-12 text-slate-50 rounded border-2 border-slate-50 hover:text-slate-200 transition-colors"
				>
					<CartIcon/>
				</button>
			)}
		</div>
	);
}

function MobileNav({ showCartIcon = false }) {
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const mobileNavRef = useRef();
	const cart = useCart();

	// Dismiss navbar when an option is chosen
	useEffect(() => {
		setOpen(false);
	}, [location]);

	// Dismiss navbar when anywhere else is clicked
	useEffect(() => {
		if(!mobileNavRef.current) return;
		const listener = e => {
			if(clickInsideOf(mobileNavRef.current, e)) return;
			setOpen(false);
		};

		document.addEventListener("click", listener);
		return () => document.removeEventListener("click", listener);
	}, []);

	return (
		<div
			className="absolute top-0 left-0 w-full block sm:hidden"
			ref={mobileNavRef}
		>
			<div className="flex flex-row justify-end gap-2 w-full h-16 p-2 z-10">
				{showCartIcon && (
					<button
						onClick={() => console.log("TODO: Open Cart Sidebar")}
						className="w-12 h-12 text-slate-50 rounded border-2 border-slate-50 hover:text-slate-200 transition-colors"
					>
						<CartIcon/>
					</button>
				)}
				<button
					onClick={() => setOpen(!open)}
					className="w-12 h-12 text-slate-50 rounded border-2 border-slate-50 hover:text-slate-200 transition-colors"
				>
					<TripleBars/>
				</button>
			</div>
			<div className={`absolute top-16 left-0 w-full flex-col bg-orange-50 ${open ? "flex" : "hidden"}`}>
				<AllNavLinks/>
			</div>
		</div>
	);
}

function StyledNavLink(props) {
	return (
		<Link
			className="min-w-[6rem] h-8 px-2 text-center flex flex-row items-center justify-center rounded border border-orange-50 hover:bg-orange-200 transition-colors"
			{...props}
		/>
	);
}

function AllNavLinks() {
	return (
		<>
			<StyledNavLink to="/menu">
				Menu
			</StyledNavLink>

			<StyledNavLink to="/menu/new">
				Add to Menu
			</StyledNavLink>

			<StyledNavLink to="/orders">
				Manage Orders
			</StyledNavLink>

			<StyledNavLink to="/upload">
				Upload Images
			</StyledNavLink>
		</>
	);
}