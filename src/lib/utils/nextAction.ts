/**
 * Generate a user-friendly message describing the next required action.
 * @param stageName Name of the current workflow stage
 * @param requiredArtifacts Array of document types required for this stage (from stages.required_artifacts)
 * @param uploadedDocTypes Array of document types already uploaded (from documents table)
 * @returns Plain‑English next step message
 */
export function getNextActionMessage(
  stageName: string,
  requiredArtifacts: string[] = [],
  uploadedDocTypes: string[] = [],
): string {
  // First check for missing required documents
  const missing = requiredArtifacts.filter(
    (doc) => !uploadedDocTypes.includes(doc),
  )
  if (missing.length > 0) {
    const docList = missing.join(', ')
    return `Please upload your ${docList}.`
  }

  // Stage‑specific messages when all required docs are present
  switch (stageName) {
    case 'EOI Submitted':
      return 'Your EOI has been received. We are reviewing your documents.'
    case 'Internal Screening':
      return 'Your application is being screened by our team.'
    case 'IELTS Prep / IELTS Pending':
      return 'Please complete your IELTS preparation and upload your result.'
    case 'Conditional Funding Assessment':
      return 'Your funding application is under review.'
    case 'Application Fee Paid':
      return 'Thank you for paying the application fee. We are preparing your university application.'
    case 'University Application Submitted':
      return 'Your university application has been submitted. Awaiting offer.'
    case 'University Offer Received':
      return 'Congratulations! Please review your offer and accept it.'
    case 'Unconditional Funding':
      return 'Your funding is confirmed. Proceeding to visa stage.'
    case 'Migration Agent Engaged':
      return 'A migration agent has been assigned to your case. They will contact you.'
    case 'Visa Lodged':
      return 'Your visa application has been lodged. Check back for updates.'
    case 'Visa Granted':
      return 'Visa granted! Prepare for travel.'
    case 'Travel & Arrival':
      return 'Welcome! Please complete enrolment.'
    case 'Enrolment Confirmed':
      return 'You are enrolled. Your post-enrolment support is active.'
    default:
      return 'No action required at this time.'
  }
}
