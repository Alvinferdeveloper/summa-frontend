import { InterviewDetails } from "@/app/(job-seeker)/applications/hooks/useMyApplications";

export interface JobApplication {
  id: number;
  status: string;
  applicant: {
    profile_id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url: string | null;
    resume_url: string | null;
  };
  interview?: InterviewDetails;
  applied_at: string;
}
