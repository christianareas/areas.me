//
// Resume
//

export type Resume = {
	candidate: Candidate
	experience: Role[]
	skillSets: SkillSet[]
	education: Credential[]
}

//
// Candidate
//

export type Candidate = {
	candidateId: string
	firstName: string
	middleName: string
	lastName: string
	who: string
	email: string
	phoneCountryCode: number
	phoneNumber: number
	website: string
	linkedIn: string
	gitHub: string
}

//
// Experience
//

export type Role = {
	candidateId: string
	roleId: string
	company: string
	role: string
	startDate: string
	endDate: string | null
	accomplishments: Accomplishment[]
}

export type Accomplishment = {
	accomplishmentId: string
	accomplishment: string
	sortOrder: number
}

//
// Skill Sets
//

export type SkillSet = {
	candidateId: string
	skillSetId: string
	skillSetType: string
	sortOrder: number
	skills: Skill[]
}

export type Skill = {
	skillId: string
	skill: string
	sortOrder: number
}

//
// Eduction
//

export type Credential = {
	candidateId: string
	credentialId: string
	institution: string
	credential: string
	startDate: string | null
	endDate: string | null
}
