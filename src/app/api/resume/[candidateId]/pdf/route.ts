// Dependencies.
import fs from "node:fs/promises"
import path from "node:path"
import { type NextRequest, NextResponse } from "next/server"
import { chromium } from "playwright-chromium"
import { validateDataFound, validateUuidFormat } from "@/lib/api/validate"
import { getCandidateByCandidateId } from "@/lib/db/resume/candidate/candidate"

//
// GET /resume/[candidateId]/pdf.
//
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ candidateId: string }> },
) {
	// Candidate ID.
	const { candidateId } = await params

	// Validate the candidate ID is a valid UUID.
	const uuidFormatValidationResponse = validateUuidFormat(candidateId)
	if (uuidFormatValidationResponse) return uuidFormatValidationResponse

	// Candidate.
	const candidate = await getCandidateByCandidateId(candidateId)

	// Validate the candidate found.
	const candidateValidationResponse = validateDataFound(
		candidate,
		"candidate",
		{ candidateId },
	)
	if (candidateValidationResponse) return candidateValidationResponse

	// Candidate name.
	const { firstName, lastName } = candidate

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
		// Create a headless browser.
		const browser = await chromium.launch({
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
		await fs.writeFile(pathToPublicDirectory, pdf)

		// Close the browser.
		await browser.close()

		// Return the PDF.
		return new NextResponse(pdf, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="${pdfName}"`,
			},
		})

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
