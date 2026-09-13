import { apiClient, aiClient } from './api';

export const jobService = {
  createJob: async (jobData) => {
    const response = await apiClient.post('/jobs', jobData);
    return response.data;
  },

  getAllJobs: async () => {
    const response = await apiClient.get('/jobs');
    return response.data;
  },

  getJobById: async (id) => {
    const response = await apiClient.get('/jobs/' + id);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await apiClient.delete('/jobs/' + id);
    return response.data;
  },
  
  applyForJob: async (jobId, atsScore) => {
    const response = await apiClient.post('/jobs/' + jobId + '/apply', { atsScore });
    return response.data;
  },
  
  getJobApplications: async (jobId) => {
    const response = await apiClient.get('/jobs/' + jobId + '/applications');
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await apiClient.put('/jobs/applications/' + applicationId + '/status', { status });
    return response.data;
  },

  updateApplicationWithDetails: async (applicationId, details) => {
    const response = await apiClient.put('/jobs/applications/' + applicationId + '/status', details);
    return response.data;
  },

  submitHiringDecision: async (applicationId, decisionData) => {
    const response = await apiClient.put('/jobs/applications/' + applicationId + '/decision', decisionData);
    return response.data;
  },

  acceptJobOffer: async (applicationId) => {
    const response = await apiClient.put('/jobs/applications/' + applicationId + '/accept-offer');
    return response.data;
  },

  getMyApplications: async () => {
    const response = await apiClient.get('/jobs/my-applications');
    return response.data;
  },

  markApplicationsViewed: async () => {
    const response = await apiClient.put('/jobs/my-applications/mark-viewed');
    return response.data;
  },

  getUnreadApplicationsCount: async () => {
    const response = await apiClient.get('/jobs/my-applications/unread-count');
    return response.data;
  },

  getScheduledInterviews: async () => {
    const response = await apiClient.get('/jobs/interviews');
    return response.data;
  },

  cancelInterview: async (applicationId) => {
    const response = await apiClient.delete('/jobs/interviews/' + applicationId);
    return response.data;
  },

  getGlobalApplications: async () => {
    const response = await apiClient.get('/jobs/global-applications');
    return response.data;
  },

  getCandidateResume: async (candidateId) => {
    const response = await apiClient.get('/resume/user/' + candidateId);
    return response.data;
  },

  downloadCandidateResume: async (candidateId, fileName = 'candidate_resume.pdf') => {
    const response = await apiClient.get('/resume/download/' + candidateId, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadMyResume: async (fileName = 'my_resume.pdf') => {
    const response = await apiClient.get('/resume/download', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  optimizeResumeText: async (jobDescription, resumeText) => {
    const response = await aiClient.post('/optimize-resume', {
      job_description: jobDescription,
      resume_text: resumeText
    });
    return response.data;
  },

  optimizeResumeUpload: async (jobDescription, file) => {
    const formData = new FormData();
    formData.append('job_description', jobDescription);
    formData.append('file', file);
    const response = await aiClient.post('/optimize-resume-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
