import logoIcon from "../images/logo.svg";
import { Link } from "react-router-dom";

export default function Nav() {
	return (
		<nav className="absolute top-0 w-full h-16 px-4 py-2 flex flex-row gap-2 items-center bg-orange-300 z-10 overflow-hidden overflow-x-auto">
			<Link
				to="/home"
				className="h-full aspect-square rounded bg-orange-50"
			>
				<img className="w-full h-full" src={logoIcon} alt="OrderUp"/>
			</Link>

			<StyledNavLink to="/menu">
				Menu
			</StyledNavLink>

			<StyledNavLink to="/menu/add">
				Add to Menu
			</StyledNavLink>

			<StyledNavLink to="/orders">
				Manage Orders
			</StyledNavLink>

			<StyledNavLink to="/upload">
				Upload Images
			</StyledNavLink>
		</nav>
	);
}

function StyledNavLink(props) {
	return (
		<Link
			className="min-w-[6rem] h-8 px-2 text-center flex flex-row items-center justify-center rounded border border-orange-50"
			{...props}
		/>
	);
}