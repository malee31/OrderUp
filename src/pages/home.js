import {Link} from "react-router-dom";
import sandwichJPG from "../images/sandwich-splash-resized.jpg";

export default function Home() {
	return (
		<>
			<section className="w-full h-full flex flex-col-reverse pt-16 md:pt-0 md:flex-row">
				<div className="md:w-3/5 h-full px-8 py-4 flex flex-col justify-center">
					<h1 className="text-4xl">OrderUp</h1>
					<h2 className="text-xl text-gray-600 mt-2 mb-1 px-1">On The Go, At Your Own Pace</h2>
					<p className="text-lg px-2">
						View the menu on your phone and place your order whenever you are ready!
						Your order will be sent directly to the back where it will be prepared and brought right out to you shortly!
					</p>
					<div className="flex flex-row">
						<Link to="/menu" className="block mt-4">
							<button className="px-4 py-2 text-xl bg-orange-300 hover:scale-105 transition-[transform] rounded">Order Now</button>
						</Link>
					</div>
				</div>
				<div className="bg-orange-400 w-full md:w-2/5 h-full overflow-hidden">
					<img
						className="w-full h-full object-cover"
						src={sandwichJPG}
						alt="Delicious Sandwich"
					/>
				</div>
			</section>
		</>
	);
}