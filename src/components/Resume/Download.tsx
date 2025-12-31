"use client"

// Dependencies.
import { LuCloudDownload } from "react-icons/lu"
import { resume } from "@/lib/db/seed/resume"

// Component.
export default function Download() {
	// Candidate.
	const { candidateId, firstName, lastName } = resume.candidate ?? {}

	// API route.
	const href = candidateId
		? `/api/resume/${encodeURIComponent(candidateId)}/pdf`
		: undefined

	// PDF name.
	const pdfName = `${firstName} ${lastName}.pdf`

	// Render.
	return (
		<section id="download-button" className="flex justify-center">
			<a
				href={href}
				download={pdfName}
				aria-disabled={!candidateId}
				onClick={(event) => {
					if (!candidateId) event.preventDefault()
				}}
			>
				<button
					type="button"
					disabled={!candidateId}
					className="flex items-center gap-2 rounded border border-neutral-500 bg-neutral-200 px-4 py-2 text-neutral-950 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-300 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-950"
				>
					<LuCloudDownload size={16} strokeWidth={2} />
					Download
				</button>
			</a>
		</section>
	)
}
