// Types.
export type Resume = {
	candidate?: Candidate
	experience?: Role[]
	skills?: Skill[]
	education?: Credential[]
}

export type Candidate = {
	candidateId: string
	firstName: string
	middleName: string
	lastName: string
	who: string
	email: string
	phoneCountryCode: string
	phoneNumber: string
	website: string
	linkedIn: string
	gitHub: string
}

export type Role = {
	candidateId: string
	roleId: string
	company: string
	role: string
	startDate: string
	endDate: string
	accomplishments?: Accomplishment[]
}

export type Accomplishment = {
	candidateId: string
	accomplishmentId: string
	accomplishment: string
	sortOrder: number
}

export type Skill = {
	candidateId: string
	skillId: string
	skillType: string
	skill: string
	sortOrder: number
}

export type Credential = {
	candidateId: string
	credentialId: string
	institution: string
	credential: string
	startDate: string
	endDate: string
}

// Resume.
export const resume: Resume = {
	//
	// Candidate.
	//
	candidate: {
		candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
		firstName: "Christian",
		middleName: "",
		lastName: "Areas",
		who: "A writer who uses their technical skills and appetite for growth to create an incredible developer experience",
		email: "me@areas.me",
		phoneCountryCode: "1",
		phoneNumber: "4088029811",
		website: "https://www.areas.me/",
		linkedIn: "https://www.linkedin.com/in/christianareas/",
		gitHub: "https://github.com/christianareas",
	},

	//
	// Experience.
	//
	experience: [
		// Postman.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			roleId: "637f9a15-ea20-4597-990b-d67bd20db1c1",
			company: "Postman",
			role: "Senior Technical Writer",
			startDate: "2024-03-18",
			endDate: "",
			accomplishments: [
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "7f4d6d8b-56c4-40a7-9c75-9d48f34a5161",
					accomplishment:
						"Started to overhaul the Postman Flows docs. Flows lets you build API-first apps on a drag-and-drop canvas.",
					sortOrder: 0,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "5ac5331b-7549-45de-b0a3-64cfbeb46cb8",
					accomplishment:
						"Built an icon library Next.js site that lists all of Postman’s icons. The Postman Docs team uses the icons to add visual cues to the docs to improve the user experience.",
					sortOrder: 1,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "af61fff1-a32e-43f4-a548-cea6b4181ebc",
					accomplishment:
						"Published an npm package that’s a Vale-compatible implementation of the Postman Style Guide. The team uses Vale to lint the docs locally and in GitHub with GitHub Actions — and ultimately ensures the docs adhere to Postman’s style.",
					sortOrder: 2,
				},
			],
		},

		// Apple (Special Projects).
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			roleId: "7b329cf8-5a11-4de8-bdc7-65696dbc1e2c",
			company: "Apple",
			role: "Senior Technical Writer, Special Projects",
			startDate: "2023-09",
			endDate: "2024-03",
			accomplishments: [
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "26c0fffc-9ce8-49c6-84ff-d404b6bc384d",
					accomplishment:
						"Designed a comprehensive workflow that manages the team’s documentation lifecycle. The workflow includes a two-step review process and an automated method to flag outdated content.",
					sortOrder: 0,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "28780fdb-38d3-487c-a84b-d05b05f0f5ef",
					accomplishment:
						"Worked with cross-functional partners to write how-tos for users who collect data and test in-development products for Apple’s research and development organization.",
					sortOrder: 1,
				},
			],
		},

		// Sabbatical.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			roleId: "3d7d7353-35ef-4be8-b32d-ee8151a13709",
			company: "Sabbatical",
			role: "",
			startDate: "2022-04",
			endDate: "2023-09",
			accomplishments: [
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "f0814cea-c88c-4f2a-bda4-c9eb779344de",
					accomplishment:
						"Completed a 24-week, full-stack JavaScript developer boot camp. Led all team projects — and in one case made over 90% of the contributions to the codebase. Learned TypeScript shortly thereafter.",
					sortOrder: 0,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "0ea02570-6c24-45ad-bd6b-fb3816dfb416",
					accomplishment:
						"Finished a 5-course, self-paced Python specialization.",
					sortOrder: 1,
				},
			],
		},

		// Apple (Apple Pay).
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			roleId: "0e6bdabb-10b6-495a-985d-26526faedfa0",
			company: "Apple",
			role: "Senior Technical Writer, Apple Pay",
			startDate: "2019-08",
			endDate: "2022-04",
			accomplishments: [
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "2107ad23-c1ae-4a8e-be58-38dd5c2eb612",
					accomplishment:
						"Functioned as Apple Pay server engineering’s sole technical writer.",
					sortOrder: 0,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "98b24a62-861c-43f9-ad29-c10d307ad933",
					accomplishment:
						"Wrote several documents from scratch, including one that explains the system behind Apple Pay Later.",
					sortOrder: 1,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "4ffd34d2-9d96-4f5f-a847-b4a1d3e8460c",
					accomplishment:
						"Worked with engineering managers and engineers across Apple Pay to gather requirements for a new docs-as-code solution to centralize Apple Pay’s API specifications.",
					sortOrder: 2,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "7c3e616e-de93-4eaa-a701-dd142148f69c",
					accomplishment:
						"Designed the docs-as-code solution. It sources Markdown and OpenAPI files from multiple GitHub repos, and uses web hooks and a CI/CD pipeline to publish the latest updates to teams across Apple. The solution supports fine-grained permissions, and gives users an easy way to create text-based message sequence diagrams.",
					sortOrder: 3,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "2b4bc481-c06e-40b6-8c5f-56bac31e6ca0",
					accomplishment:
						"Interviewed nearly 50 candidates to hire Apple Pay server engineering’s second technical writer.",
					sortOrder: 4,
				},
			],
		},

		// Apple (Employee Productivity).
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			roleId: "b985c1d0-0f7f-46d6-a39d-ebbd0a8db7aa",
			company: "Apple",
			role: "Senior Technical Writer, Employee Productivity",
			startDate: "2015-07",
			endDate: "2019-08",
			accomplishments: [
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "55008b01-eafa-4308-98bb-d1fcda84a0a7",
					accomplishment:
						"Wrote in the Apple voice for Apple employees — guides and how-tos for everyday users, new employees, managers, and other audiences.",
					sortOrder: 0,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "546660bd-1062-4966-bc08-15690742973d",
					accomplishment:
						"Referenced the Apple Style Guide, Human Interface Guidelines (HIG), Chicago Manual of Style, and other resources to maintain consistency across content.",
					sortOrder: 1,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "124deb74-8b4b-4acf-a094-dcaa47eee508",
					accomplishment: "Managed and mentored writers.",
					sortOrder: 2,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "5331572b-e99f-4c63-8a01-4d7ac5b24318",
					accomplishment:
						"Led major, cross-functional projects — such as the complete overhaul of one of Apple’s main internal sites — and subsequently iterated to improve the user experience.",
					sortOrder: 3,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "6c7f62ee-3f84-4aa9-a84a-cbd3d90e1ac0",
					accomplishment:
						"Wrote SQL queries to generate reports. Used the data to answer questions and drive decisions.",
					sortOrder: 4,
				},
			],
		},

		// MGT.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			roleId: "637f9a15-ea20-4597-990b-d67bd20db1c1",
			company: "MGT",
			role: "Documentation Manager",
			startDate: "2013-10",
			endDate: "2015-7",
			accomplishments: [
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "1a2c1ea7-97ae-4058-a1e4-7d7d797064ef",
					accomplishment:
						"Authored key documents from scratch to support the startup, including a 150+ page internal control system (ICS), information security policies, anti-money laundering (AML) and countering the financing of terrorism (CFT) policies, and more.",
					sortOrder: 0,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "0579a5bd-6abf-47dd-b64c-34badb306016",
					accomplishment:
						"Wrote functional specifications for user registration, know your customer (KYC), and deposit and withdrawal flows.",
					sortOrder: 1,
				},
				{
					candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
					accomplishmentId: "e8bf3337-33a7-412a-90d1-4ddcc3078396",
					accomplishment:
						"Developed 20+ SQL queries to output all financial and operational data — registrations, logins, deposits and withdrawals, gaming activity, liabilities, and other metrics.",
					sortOrder: 2,
				},
			],
		},
	],

	//
	// Skills.
	//
	skills: [
		// Languages.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "6d07e824-66d5-4337-9398-628f284e610f",
			skillType: "languages",
			skill: "Bash",
			sortOrder: 0,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "aa5ac7c3-82d0-4c64-9f84-eb4315c70558",
			skillType: "languages",
			skill: "JavaScript and TypeScript",
			sortOrder: 1,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "54453dab-4401-4f1a-bc51-45bb92164e40",
			skillType: "languages",
			skill: "JSON",
			sortOrder: 2,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "7cead30f-24ac-4b67-9d2c-283f6f26bd97",
			skillType: "languages",
			skill: "Markdown",
			sortOrder: 3,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "314df7bb-fa03-4a93-8802-29cca9db0989",
			skillType: "languages",
			skill: "Python",
			sortOrder: 4,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "e02050b4-9920-466f-a85c-4bd09409f36f",
			skillType: "languages",
			skill: "Regex",
			sortOrder: 5,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "3fb48ca5-c5b7-4eff-86aa-fe35649c9365",
			skillType: "languages",
			skill: "SQL",
			sortOrder: 6,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "e1a28074-7f04-4ded-acf1-d26bcff75376",
			skillType: "languages",
			skill: "YAML",
			sortOrder: 7,
		},

		// Specifications.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "4044c487-dafa-46d3-b292-7ed31f0773b2",
			skillType: "specifications",
			skill: "GraphQL",
			sortOrder: 0,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "0f0e15de-f24d-4eb4-ae3b-e3d9aba3dae7",
			skillType: "specifications",
			skill: "gRPC",
			sortOrder: 1,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "8146b1b7-7bef-48f8-9cee-9dfacea111ad",
			skillType: "specifications",
			skill: "JWT",
			sortOrder: 2,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "942f9e68-d2c4-409b-aacc-eebace3b5c27",
			skillType: "specifications",
			skill: "OpenAPI",
			sortOrder: 3,
		},

		// Command-line tools.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "1c38c32c-e181-42ec-b970-c6ad688d167e",
			skillType: "command-line-tools",
			skill: "Git",
			sortOrder: 0,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "84af94e8-f87d-49fc-bcaa-74e47a873c4f",
			skillType: "command-line-tools",
			skill: "GitHub CLI",
			sortOrder: 1,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "fa98f117-d48d-4dee-b029-a1862e2ad83d",
			skillType: "command-line-tools",
			skill: "brew",
			sortOrder: 2,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "09d303b9-e689-4eb6-9eba-f2e2c03cf08f",
			skillType: "command-line-tools",
			skill: "npm",
			sortOrder: 3,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "70fe1fab-a1b0-4c68-9544-df3d049c0faf",
			skillType: "command-line-tools",
			skill: "Vale",
			sortOrder: 4,
		},

		// Databases.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "104bfb81-52d0-4686-9b58-f249ce78e368",
			skillType: "databases",
			skill: "MongoDB",
			sortOrder: 0,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "05269164-8278-4b46-982f-a74e3cdeaf0b",
			skillType: "databases",
			skill: "MariaDB",
			sortOrder: 1,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "b1f04267-b7ee-4f84-b515-ea30589171ed",
			skillType: "databases",
			skill: "MySQL",
			sortOrder: 2,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "f97804cf-dc51-4d7c-8b32-7b0f10d94e49",
			skillType: "databases",
			skill: "PostgreSQL",
			sortOrder: 3,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "a228ead0-9e6c-488b-88cb-9ef43bd9c343",
			skillType: "databases",
			skill: "SQLite",
			sortOrder: 4,
		},

		// Frameworks.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "da20674f-b931-48ee-91e8-b9c436cb5d57",
			skillType: "frameworks",
			skill: "Next.js",
			sortOrder: 0,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "55aa0f18-bf13-4a06-8927-cc956988e85d",
			skillType: "frameworks",
			skill: "Node.js",
			sortOrder: 1,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "0bde359b-0237-4c24-93de-8fe315f0ba8e",
			skillType: "frameworks",
			skill: "React.js",
			sortOrder: 2,
		},

		// Apps.
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "3d506368-077d-4b4c-8ade-d34912ae59ea",
			skillType: "apps",
			skill: "Confluence and Jira",
			sortOrder: 0,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "0177a77f-344b-47fe-b56d-7735a997e610",
			skillType: "apps",
			skill: "Figma",
			sortOrder: 1,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "74769530-845b-45c4-9b26-e19700ccc33a",
			skillType: "apps",
			skill: "Postman",
			sortOrder: 2,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "3531aad4-0f41-423a-9bee-46611808e611",
			skillType: "apps",
			skill: "Terminal and Warp",
			sortOrder: 3,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "545b7551-1ec3-471a-8bc9-d27e56637f4a",
			skillType: "apps",
			skill: "Visual Studio Code",
			sortOrder: 4,
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			skillId: "5e30bba5-c37b-4375-a15c-2a48e2fafa9c",
			skillType: "apps",
			skill: "Xcode",
			sortOrder: 5,
		},
	],

	//
	// Education.
	//
	education: [
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			credentialId: "c560a09f-e1c0-438b-bdee-40b08193aa71",
			institution: "University of Michigan (Coursera)",
			credential: "Specialization Certificate, Python for Everyone",
			startDate: "",
			endDate: "",
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			credentialId: "6d2a04b3-3aae-48fe-a96a-95bbc0072d0f",
			institution: "UC Berkeley Extension",
			credential: "Certificate of Completion, Full-Stack JavaScript Developer",
			startDate: "",
			endDate: "",
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			credentialId: "424c3311-d868-4dae-94be-178bf12602d6",
			institution: "Emory University",
			credential: "MPH, Epidemiology (Coursework Complete)",
			startDate: "",
			endDate: "",
		},
		{
			candidateId: "d5a5e5dc-f2dd-4f5a-8745-0e835d9f26a5",
			credentialId: "96375c83-3995-48b7-a118-131572b154f3",
			institution: "UC Berkeley",
			credential: "BA, English and Premed",
			startDate: "",
			endDate: "",
		},
	],
}
