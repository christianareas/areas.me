// Dependencies.
import type { Role as RoleType } from "@/types/resume"
import { formatDate } from "@/util/resume"

// Types.
type ExperienceProps = {
	experience: RoleType[]
}

// Component.
export default function Experience({
	experience: unsortedExperience,
}: ExperienceProps) {
	// Sort experience by start date (newest to oldest).
	const experience = [...unsortedExperience].sort((a, b) =>
		b.startDate.localeCompare(a.startDate),
	)

	// Render.
	return (
		<section className="mx-auto flex max-w-5xl flex-col justify-center space-y-5 text-center">
			<h3 className="text-center font-bold text-xl uppercase lg:text-left">
				Experience
			</h3>

			<section className="space-y-10">
				{experience.map((role, index) => {
					const accomplishments = role.accomplishments
						.slice()
						.sort((a, b) => a.sortOrder - b.sortOrder)

					const previousRole = index > 0 ? experience[index - 1] : null
					const displayCompany =
						!previousRole || previousRole.company !== role.company

					return (
						<section
							className="flex flex-col space-y-3 lg:flex-row lg:justify-start lg:space-x-20 lg:space-y-0"
							key={role.roleId}
						>
							<section className="lg:w-1/6 lg:text-left">
								{/*
									********
									Company
									********
								*/}
								{displayCompany && (
									<h4 className="font-bold text-xl">{role.company}</h4>
								)}

								{/*
									****
									Role
									****
								*/}
								{role.role && (
									<h5 className="font-light text-base">{role.role}</h5>
								)}

								{/*
									*****
									Dates
									*****
								*/}
								<h6 className="font-extralight text-sm italic">
									{formatDate(role.startDate)} –{" "}
									{role.endDate ? formatDate(role.endDate) : "Present"}
								</h6>
							</section>

							<section className="lg:w-5/6">
								{/*
									***************
									Accomplishments
									***************
								*/}
								{accomplishments.length > 0 && (
									<ul className="list-disc space-y-2 pl-3 text-justify font-extralight text-sm">
										{accomplishments.map((ac) => (
											<li key={ac.accomplishmentId}>{ac.accomplishment}</li>
										))}
									</ul>
								)}
							</section>
						</section>
					)
				})}
			</section>
		</section>
	)
}
