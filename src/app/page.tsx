export const dynamic = "force-dynamic"

// Dependencies.
import { notFound } from "next/navigation"
import Resume from "@/components/Resume"
import { getResume } from "@/lib/data/resume"
import { getFirstCandidateId } from "@/lib/db/resume/candidate/candidate"

// Page.
export default async function Home() {
	// Candidate ID.
	const candidateId = await getFirstCandidateId()
	if (!candidateId) notFound()

	// Resume.
	const resume = await getResume(candidateId)
	if (!resume) notFound()

	// Render.
	return <Resume resume={resume} />
}
