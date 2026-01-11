export const revalidate = 0

// Dependencies.
import { notFound } from "next/navigation"
import Resume from "@/components/Resume"
import { findFirstCandidateId } from "@/lib/db/resume/candidate/sql"
import { findResumeByCandidateId } from "@/lib/db/resume/sql"

// Page.
export default async function Home() {
	// Candidate ID.
	const candidateId = await findFirstCandidateId()
	if (!candidateId) notFound()

	// Resume.
	const resume = await findResumeByCandidateId(candidateId)
	if (!resume) notFound()

	// Render.
	return <Resume resume={resume} />
}
