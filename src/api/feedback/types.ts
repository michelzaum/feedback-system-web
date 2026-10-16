export type FeedbackStatus = "PENDING" | "IN_REVIEW" | "COMPLETED";

export interface CreateFeedbackPayload {
  title: string;
  description: string;
}

export interface UpdateFeedbackPayload {
  status: FeedbackStatus;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  status: FeedbackStatus;
}
