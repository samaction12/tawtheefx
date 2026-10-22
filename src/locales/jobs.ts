import { JobListing, JobType, SeededJob } from '../types';
import { TranslationDict, TranslationKey } from './translations';

/** Label key for every neutral employment type identifier. */
export const JOB_TYPE_LABEL_KEYS: Record<JobType, TranslationKey> = {
  fulltime: 'jobs_type_fulltime',
  remote: 'jobs_type_remote',
  hybrid: 'jobs_type_hybrid',
  contract: 'jobs_type_contract',
};

/**
 * Resolves a seeded job (whose copy is stored as translation keys) into the
 * plain `JobListing` shape consumed by the UI, keeping the data layer
 * language neutral.
 */
export const localizeJob = (job: SeededJob, t: TranslationDict): JobListing => ({
  id: job.id,
  title: t[job.titleKey],
  company: t[job.companyKey],
  companyLogo: job.companyLogo,
  location: t[job.locationKey],
  type: job.type,
  department: t[job.departmentKey],
  salary: t[job.salaryKey],
  postedDate: t[job.postedDateKey],
  deadline: job.deadline,
  featured: job.featured,
  requiresVideoInterview: job.requiresVideoInterview,
  description: t[job.descriptionKey],
  requirements: job.requirementKeys.map((key) => t[key]),
  benefits: job.benefitKeys.map((key) => t[key]),
  applicantsCount: job.applicantsCount,
});
