const defaultStyleWords = [
  {
    style: 'font-weight:bold',
    words: [
      'WEBREMOTEWS MPXR interface update',
      'WEBMREMOTEWS Service Notification interface update',
      'WEBREMOTEWS INTERFACE UPDATE',
      'Work Order',
      'CasePart-',
      'workorderNumber',
      'AFC',
      'Contact Name',
      'Facility ID',
      'Contact',
      'Account',
      'Surgeon',
      'When Issue Occurred',
      'Length of Extended Surgical Time',
      'What Software Task When Issue Occurred',
      'EventSummary',
      'lengthOfExternalSurgicalTime',
      'Next Action/Resolution',
      'Description',
      'Was Medtronic Imaging Aborted',
      'Surgery Aborted',
      'Was Navigation Aborted',
      'Type of Surgical Procedure',
      'Was a Patient Involved',
      'Patient Id',
      'Patient Gender',
      'Patient Age Units',
      'Patient Weight',
      'Patient Weight Units',
      'Patient Date of Birth',
      'PEI',
      'Contact Name',
      'Facility ID',
      'Contact',
      'Account',
      'Surgeon',
      'MNAV Comment ID:',
      'MNAV Comment Subject:',
      'MNAV Comment:',
      'MNAV Created By:',
      'MNAV Created Date:',
      'MNAV Case Part:',
      'Date Completed',
      'Action/Resolution',
      'Event confirmed?',
      'Symptom',
      'Most Probable Cause',
      'Probable Cause',
      'Resolution',
      'Verification',
      'System Status',
      'Mechanical Inspection',
      'Mechanical Inspection Failure',
      'Mechanical Inspection Summary of Failure(s)',
      'Does the System Perform as Intended?',
      'Imaging Modalities Failure',
      'Imaging Summary of Failure(s)',
      'Imaging Modalities',
      'Failure Mode',
      'Able To Duplicate The Issue',
      'Findings and Conclusions',
      'Failure Mechanism',
      'Methodology',
      'Tested By Date',
      'Surgeon',
      'Lot #',
      'Cause Code Description',
      'Cause Code',
      'Cause Code Text',
      'Date Received Back',
      'Next Action',
      'Action',
      'Possession',
      'Logs and Archive Uploaded',
      'Software Version',
      'No Return Justification',
      'Finding & conclusions',
      'Resolution confirmed on call',
      'Were hardware parts replaced?',
      'Finding & Conclusions',
      'Returned Unused',
      'Initial Reporter',
      'General Summary of Failure(s)',
      'Is General Failure Resolved?',
      'Hardware Failure',
      'Return Item Status'
    ]
  },
  {
    style: 'color:green',
    words: [
      'Work Order',
      'workorderNumber',
      'Date Completed',
      'CasePart',
      'AFC',
      'Date Completed',
      'Does the System Perform as Intended?',
      'Imaging Modalities Failure',
      'Imaging Summary of Failure(s)',
      'Imaging Modalities',
      'Lot #',
      'Were hardware parts replaced?',
      'Returned Unused',
      'Mechanical Inspection',
      'Mechanical Inspection Failure',
      'Mechanical Inspection Summary of Failure(s)'
    ]
  },
  {
    style: 'color:blue',
    words: [
      'When Issue Occurred',
      'Length of Extended Surgical Time',
      'What Software Task',
      'EventSummary',
      'lengthOfExternalSurgicalTime',
      'Next Action/Resolution',
      'Next Action',
      'Description',
      'Possession',
      'No Return Justification',
      'Software Version',
      'Date Received Back',
      'Logs and Archive Uploaded',
      'PASS',
      'YES',
      'Return Item Status'

    ]
  },
  {
    style: 'color:red',
    words: [
      'Was Medtronic Imaging Aborted',
      'Surgery Aborted',
      'Was Navigation Aborted',
      'Type of Surgical Procedure',
      'Was a Patient Involved',
      'Patient Id',
      'Patient Gender',
      'Patient Age Units',
      'Patient Weight',
      'Patient Weight Units',
      'Patient Date of Birth',
      'PEI',
      'MNAV Created Date:',
      'FAIL'
    ]
  },
  {
    style: 'color:purple',
    words: [
      'Contact Name',
      'Facility ID',
      'Contact',
      'Account',
      'Surgeon',
      'Initial Reporter'
    ]
  },
  {
    style: 'background:white',
    words: ['AFC', 'Lot #']
  },
  {
    style: 'background:yellow',
    words: [
      'Action/Resolution',
      'Event confirmed?',
      'Symptom',
      'Most Probable Cause',
      'Most probable Cause',
      'Resolution',
      'Verification',
      'System Status',
      'Failure Mode',
      'Able To Duplicate The Issue',
      'Findings and Conclusions',
      'Failure Mechanism',
      'Methodology',
      'Tested By Date',
      'Cause Code Description',
      'Cause Code',
      'Cause Code Text',
      'Probable Cause',
      'Next Action',
      'Action',
      'Resolution confirmed on call',
      'General Summary of Failure(s)',
      'Is General Failure Resolved?',
      'Finding & Conclusions',
      'Hardware Failure'
    ]
  }
]
const config = {
  'Advance Ablation Solutions (AAS)': { 
    styleWords: defaultStyleWords,
  },
  'Advanced Energy': { 
    styleWords: defaultStyleWords,
  },
  'Advanced Surgical Technologies': { 
    styleWords: defaultStyleWords,
  },
  'Airways': { 
    styleWords: defaultStyleWords,
  },
  'Aortic': { 
    styleWords: defaultStyleWords,
  },
  'Cardiac Ablation Solutions (CAS)': { 
    styleWords: defaultStyleWords,
  },
  'Cardiac Pacing Therapies (CPT)': { 
    styleWords: defaultStyleWords,
  },
  'China Cranial, Spinal, & Orthopedic Technologies': { 
    styleWords: defaultStyleWords,
  },
  'Coronary and Renal Denervation': { 
    styleWords: defaultStyleWords,
  },
  'CSF Therapies': { 
    styleWords: defaultStyleWords,
  },
  'Deep Brain Stimulation (DBS)': { 
    styleWords: defaultStyleWords,
  },
  'Defibrillation Solutions (DS)': { 
    styleWords: defaultStyleWords,
  },
  'Digital Technologies': { 
    styleWords: defaultStyleWords,
  },
  'Ear, Nose & Throat': { 
    styleWords: defaultStyleWords,
  },
  'Endoscopy': { 
    styleWords: defaultStyleWords,
  },
  'EndoVenous': { 
    styleWords: defaultStyleWords,
  },
  'ET Imaging': { 
    styleWords: defaultStyleWords,
  },
  'ET Navigation': { 
    styleWords: defaultStyleWords,
  },
  'Extracorporeal Therapies (ECT)': { 
    styleWords: defaultStyleWords,
  },
  'General Surgical Technologies': { 
    styleWords: defaultStyleWords,
  },
  'Mazor Robotics': { 
    styleWords: defaultStyleWords,
  },
  'Mechanical Circulatory Support (MCS)': { 
    styleWords: defaultStyleWords,
  },
  'Neurovascular': { 
    styleWords: defaultStyleWords,
  },
  'Patient Care Systems (PCS) and Cardiovascular Diagnostics and Services (CDS)': { 
    styleWords: defaultStyleWords,
  },
  'Patient Management': { 
    styleWords: defaultStyleWords,
  },
  'Patient Monitoring': { 
    styleWords: defaultStyleWords,
  },
  'Pelvic Health (PH)': { 
    styleWords: defaultStyleWords,
  },
  'Peripheral Vascular Health (PVH)': { 
    styleWords: defaultStyleWords,
  },
  'Powered Surgical Solutions (PSS)': { 
    styleWords: defaultStyleWords,
  },
  'Radiofrequency Ablation (RFA)': { 
    styleWords: defaultStyleWords,
  },
  'Robotic Surgical Technologies': { 
    styleWords: defaultStyleWords,
  },
  'Spinal Cord Stimulation (SCS)': {
    styleWords: defaultStyleWords,
  },
  'Spine': { 
    styleWords: defaultStyleWords,
  },
  'Surgical Valve Therapies (SVT)': { 
    styleWords: defaultStyleWords,
  },
  'Targeted Drug Delivery (TDD)': { 
    styleWords: defaultStyleWords,
  },
  'Transcatheter Therapies (TCT)': {
    styleWords: defaultStyleWords,
  },
  'Ventilation':{
    styleWords: defaultStyleWords,
  }
};
export default config