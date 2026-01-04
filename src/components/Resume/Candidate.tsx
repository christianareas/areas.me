// Dependencies.
import Link from "next/link"
import { LuGithub, LuLinkedin, LuMail } from "react-icons/lu"
import type { Candidate as CandidateType } from "@/types/resume"
import { formatUrl } from "@/util/resume"

// Types.
type CandidateProps = {
	candidate: CandidateType
}

// Component.
export default function Candidate({ candidate }: CandidateProps) {
	// Render.
	return (
		<section className="mx-auto flex max-w-5xl flex-col justify-center space-y-3 lg:flex-row lg:items-start lg:justify-between lg:space-x-0 lg:space-y-0">
			<section className="text-center lg:text-left">
				{/*
					*******************
					First and last name
					*******************
				*/}
				<h1 className="font-lexend-zetta font-medium text-4xl uppercase lg:text-5xl">
					{candidate.firstName} {candidate.lastName}
				</h1>

				{/*
				***
				Who
				***
				*/}
				<h2 className="font-extralight text-sm italic">{candidate.who}</h2>
			</section>

			<section className="text-center text-sm lg:min-w-50 lg:text-right">
				<ul className="space-y-1.5">
					{/*
						*****
						Email
						*****
					*/}
					{candidate.email && (
						<li className="text-blue-400 text-xs">
							<Link
								className="flex justify-center gap-1.5 lg:justify-end"
								href={`mailto:${candidate.email}`}
							>
								<LuMail size={12} className="mt-0.5" strokeWidth={1.5} />
								{candidate.email}
							</Link>
						</li>
					)}

					{/*
						********
						LinkedIn
						********
					*/}
					{candidate.linkedIn && (
						<li className="text-blue-400 text-xs">
							<Link
								className="flex justify-center gap-1.5 lg:justify-end"
								href={candidate.linkedIn}
							>
								<LuLinkedin size={12} className="mt-0.5" strokeWidth={1.5} />
								{formatUrl(candidate.linkedIn)}
							</Link>
						</li>
					)}

					{/*
						******
						GitHub
						******
					*/}
					{candidate.gitHub && (
						<li className="text-blue-400 text-xs">
							<Link
								className="flex justify-center gap-1.5 lg:justify-end"
								href={candidate.gitHub}
							>
								<LuGithub size={12} className="mt-0.5" strokeWidth={1.5} />
								{formatUrl(candidate.gitHub)}
							</Link>
						</li>
					)}
				</ul>
			</section>
		</section>
	)
}
