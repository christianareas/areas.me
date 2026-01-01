// Dependencies.
import type { Credential as CredentialType } from "@/types/resume"

// Types.
type EducationProps = {
	education: CredentialType[]
}

// Component.
export default function Education({ education }: EducationProps) {
	// Render.
	return (
		<section className="mx-auto flex max-w-5xl flex-col justify-center space-y-5 lg:flex-row lg:justify-start lg:space-x-20">
			<h3 className="text-center font-bold text-xl uppercase lg:w-1/6 lg:text-left">
				Education
			</h3>

			<section className="text-sm lg:w-5/6">
				<ul className="list-disc space-y-2 pl-3 text-left">
					{education.map((credential) => (
						<li
							key={credential.credentialId}
							className="font-extralight text-sm"
						>
							{credential.credential} | {credential.institution}
						</li>
					))}
				</ul>
			</section>
		</section>
	)
}
