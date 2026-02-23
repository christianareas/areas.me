// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import Link from "next/link"

// --------------------------------------------------------------------------------
// Types.
// --------------------------------------------------------------------------------

type HeaderProps = {
	page: "home" | "resume"
}

// --------------------------------------------------------------------------------
// Header component.
// --------------------------------------------------------------------------------

export default function Header({ page }: HeaderProps) {
	// Render.
	return (
		<header className="flex h-screen flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white">
			{/*
				****
				Logo
				****
			*/}
			<section>
				<p className="font-extralight">
					<Link href="/">
						<span className="text-9xl">areas</span>
						<span className="text-3xl">.me</span>
					</Link>
				</p>
			</section>

			{/*
				****
				Menu
				****
			*/}
			<section className="flex space-x-5 text-xl">
				<p
					className={`hover:text-blue-400 ${page === "home" ? "underline" : ""}`}
				>
					<Link href="/">home</Link>
				</p>
				<p
					className={`hover:text-blue-400 ${page === "resume" ? "underline" : ""}`}
				>
					<Link href="/resume">resume</Link>
				</p>
			</section>
		</header>
	)
}

// --------------------------------------------------------------------------------
