export interface CreateFeedbackPayload {
  title: string;
  description: string;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  projectId: string;
  createdAt: string;
}
