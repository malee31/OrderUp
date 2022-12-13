import receiptPNG from "../images/receipt-printer.png";

export default function Home() {
	return (
		<main>
			<section>
				<div className="home-hero-content">
					<h1>OrderUp</h1>
					<h2>On The Go, At Your Own Pace</h2>
					<p>
						View the menu on your phone and place your order whenever you are ready!<br/>
						Your order will be sent directly to the back where it will be prepared and brought right out to you shortly!
					</p>
				</div>
				<div className="home-hero-visuals">
					<img
						src={receiptPNG}
						alt="Receipt Icon"
					/>
				</div>
			</section>
			OrderUp
		</main>
	)
}