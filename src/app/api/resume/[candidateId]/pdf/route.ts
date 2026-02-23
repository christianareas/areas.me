// --------------------------------------------------------------------------------
// Dependencies.
// --------------------------------------------------------------------------------

import fs from "node:fs/promises"
import path from "node:path"
import { type NextRequest, NextResponse } from "next/server"
import { chromium } from "playwright-chromium"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { findCandidateByCandidateId } from "@/lib/db/resume/candidate/sql"

// --------------------------------------------------------------------------------
// GET /api/resume/[candidateId]/pdf.
// --------------------------------------------------------------------------------

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// If the candidate ID isn’t a valid UUID, return 400.
	const uuidFormatErrorResponse = validateUuidFormat([candidateId])
	if (uuidFormatErrorResponse) return uuidFormatErrorResponse

	// Found candidate.
	const foundCandidate = await findCandidateByCandidateId(candidateId)

	// If the candidate’s not found, return 404.
	const candidateErrorResponse = validateDataFound(
		foundCandidate,
		"candidate",
		{ candidateId },
	)
	if (candidateErrorResponse) return candidateErrorResponse

	// Candidate name.
	const { firstName, lastName } = foundCandidate

	// PDF name and location.
	const pdfName = `${firstName} ${lastName}.pdf`
	const pathToPublicDirectory = path.join(
		process.cwd(),
		"public",
		"resume",
		pdfName,
	)

	// Node environment.
	const nodeEnvironment = process.env.NODE_ENV

	// If in a development environment, generate the PDF.
	if (nodeEnvironment === "development") {
		let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null

		try {
			// Create a headless browser.
			browser = await chromium.launch({
				headless: true,
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			})
			const browserContext = await browser.newContext({
				viewport: { width: 1280, height: 900 },
			})

			// Prepare the PDF.
			const resumePage = await browserContext.newPage()
			await resumePage.emulateMedia({ media: "screen" })
			const resumeUrl = new URL("/", request.url).toString()
			await resumePage.goto(resumeUrl, { waitUntil: "networkidle" })
			await resumePage.evaluate(() => {
				document.getElementById("download-button")?.remove()
				document.querySelector("[data-nextjs-dev-overlay]")?.remove()
			})

			// Generate the PDF.
			const pdfBuffer = await resumePage.pdf({
				format: "A3",
				margin: {
					top: "0",
					bottom: "0",
					left: "0",
					right: "0",
				},
				scale: 0.88,
			})
			const pdf = new Uint8Array(pdfBuffer)

			// Save the PDF to public/resume/.
			await fs.mkdir(path.dirname(pathToPublicDirectory), { recursive: true })
			await fs.writeFile(pathToPublicDirectory, pdf)

			// Return the PDF.
			return new NextResponse(pdf, {
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": `attachment; filename="${pdfName}"`,
				},
			})
		} finally {
			if (browser) await browser.close()
		}

		// Otherwise, get the PDF from public/resume/.
	} else {
		try {
			// Get the PDF.
			const pdfBuffer = await fs.readFile(pathToPublicDirectory)
			const pdf = new Uint8Array(pdfBuffer)

			// Return the PDF.
			return new NextResponse(pdf, {
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": `attachment; filename="${pdfName}"`,
				},
			})
		} catch {
			// Return not found.
			return NextResponse.json({ error: "Not Found" }, { status: 404 })
		}
	}
}

// --------------------------------------------------------------------------------
