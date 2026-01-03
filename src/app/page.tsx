export const revalidate = 0

// Dependencies.
import { notFound } from "next/navigation"
import Resume from "@/components/Resume"
import { getResumeByCandidateId } from "@/lib/db/resume"
import { getFirstCandidateId } from "@/lib/db/resume/candidate/candidate"

// Page.
export default async function Home() {
	// Candidate ID.
	const candidateId = await getFirstCandidateId()
	if (!candidateId) notFound()

	// Resume.
	const resume = await getResumeByCandidateId(candidateId)
	if (!resume) notFound()

	// Render.
	return <Resume resume={resume} />
}
