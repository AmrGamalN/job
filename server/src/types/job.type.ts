export type JobSortType = {
  salary?: number;
  views?: number;
  createdAt?: number;
};

export type JobFiltersType = {
  page: number;
  limit: number;
  start?: Date;
  end?: Date;
  salaryMin?: number;
  salaryMax?: number;
  department?: string;
  location?: string;
  skills?: string;
  jobExperience?: string;
  applicantTypes?: string;
  jobType?: string;
  workplaceType?: string;
  jobTitle?: string;
};

export type JobAppFiltersType = {
  page: number;
  limit: number;
  start?: Date;
  end?: Date;
  currentAddress?: string;
  jobExperience?: string;
  applicantTypes?: string;
  jobType?: string;
  workplaceType?: string;
  jobTitle?: string;
};

export type SortType = {
  createdAt?: number;
};

export type InterviewFiltersType = {
  page: number;
  limit: number;
  start?: Date;
  end?: Date;
  interviewStatus?: string;
  interviewPlatform?: string;
  interviewResult?: string;
};

export const analyticsFields = [
  // Job Application
  "totalJobAppCreated",
  "totalInterested",
  "totalViews",

  // ApplicantTypes
  "totalStudent",
  "totalGraduate",
  "totalJoiner",
  "totalEntry-Level",
  "totalMid-Level",
  "totalSenior",
  "totalManager",
  "totalFreelancer",
  "totalExecutive",
  "totalIntern",
  "totalCareer-Shifter",

  // JobType
  "totalFull-Time",
  "totalPart-Time",
  "totalInternship",
  "totalFreelance",
  "totalSeasonal",
  "totalApprenticeship",
  "totalContract",

  // WorkPlace
  "totalRemote",
  "totalOn-site",
  "totalHybrid",

  // Interview status
  "totalInterviewed",
  "totalPending",
  "totalRejected",
  "totalShortlisted",
  "totalPassed",

  // Interview result
  "totalFailed",
  "totalOn-hold",
  "totalHired",
];

export const ApplicantTypes = [
  "student",
  "graduate",
  "joiner",
  "entry_level",
  "mid_level",
  "senior",
  "manager",
  "freelancer",
  "intern",
  "career_shifter",
] as const;

export const JobTypes = [
  "full_time",
  "part_time",
  "internship",
  "freelance",
  "seasonal",
  "apprenticeship",
  "contract",
] as const;

export const JobExperiences = [
  "fresh-grad",
  "less-than-1-year",
  "1-2-years",
  "2-3-years",
  "3-4-years",
  "4-5-years",
  "5-6-years",
  "6-7-years",
  "7-8-years",
  "8-9-years",
  "9-10-years",
] as const;

export const WorkplaceTypes = ["remote", "on-site", "hybrid"] as const;
