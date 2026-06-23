import { Heart } from "lucide-react";

export function Footer() {
	const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

	return (
		<footer className="border-t border-border py-6 px-4">
			<div className="mx-auto max-w-4xl flex flex-col items-center gap-3 text-sm text-muted-foreground">
				<div className="flex items-center gap-4">
					{stripeLink && (
						<a
							href={stripeLink}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
						>
							<Heart className="h-4 w-4" />
							<span>気に入ったら応援する</span>
						</a>
					)}
				</div>
				<p>&copy; {new Date().getFullYear()} Southern Cross Lab</p>
			</div>
		</footer>
	);
}
