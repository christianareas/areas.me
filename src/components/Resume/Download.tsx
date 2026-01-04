// Dependencies.
import { LuCloudDownload } from "react-icons/lu"
import type { Candidate as CandidateType } from "@/types/resume"

// Types.
type DownloadProps = {
	candidate: CandidateType
}

// Component.
export default function Download({ candidate }: DownloadProps) {
	// Candidate name.
	const { candidateId, firstName, lastName } = candidate

	// API route.
	const href = `/api/resume/${encodeURIComponent(candidateId)}/pdf`

	// PDF name.
	const pdfName = `${firstName} ${lastName}.pdf`

	// Render.
	return (
		<section id="download-button" className="flex justify-center">
			<a href={href} download={pdfName}>
				<button
					type="button"
					className="flex items-center gap-2 rounded border border-neutral-500 bg-neutral-200 px-4 py-2 text-neutral-950 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-300 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-950"
				>
					<LuCloudDownload size={16} strokeWidth={2} />
					Download
				</button>
			</a>
		</section>
	)
}
