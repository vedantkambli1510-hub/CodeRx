export type QuestionType =
  | "text"
  | "textarea"
  | "yes_no"
  | "single_select"
  | "multi_select"
  | "severity_scale"
  | "pain_scale"
  | "date"
  | "list"
  | "file_upload";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionCondition {
  dependsOnKey: string;
  equals?: string | boolean;
  notEquals?: string | boolean;
  inList?: string[];
}

export interface QuestionDefinition {
  key: string;
  section: string;
  sectionTitle: string;
  prompt: string;
  helpText?: string;
  placeholder?: string;
  type: QuestionType;
  options?: QuestionOption[];
  required?: boolean;
  condition?: QuestionCondition;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export const INTAKE_QUESTIONS: QuestionDefinition[] = [
  // Section A: Basic Information
  {
    key: "patient_name",
    section: "A",
    sectionTitle: "Basic Information",
    prompt: "Confirm your full name for this consultation",
    placeholder: "e.g. Aarav Demo",
    type: "text",
    required: true,
  },
  {
    key: "patient_dob",
    section: "A",
    sectionTitle: "Basic Information",
    prompt: "Date of Birth or Age",
    helpText: "Helps your doctor contextualize normal vital and history ranges.",
    placeholder: "YYYY-MM-DD or Age (e.g. 29 years)",
    type: "text",
    required: false,
  },
  {
    key: "patient_gender",
    section: "A",
    sectionTitle: "Basic Information",
    prompt: "Gender / Sex (if voluntarily provided)",
    type: "single_select",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Non-binary", label: "Non-binary" },
      { value: "Prefer not to say", label: "Prefer not to say" },
    ],
    required: false,
  },

  // Section B: Primary Concern
  {
    key: "primary_concern",
    section: "B",
    sectionTitle: "Current Concern",
    prompt: "What is the main health concern you would like to discuss with the doctor?",
    helpText: "Describe what has been bothering you in your own words. You do not need to name an illness.",
    placeholder: "e.g., Persistent throbbing headache with neck stiffness for the past three days.",
    type: "textarea",
    required: true,
  },

  // Section C: Symptoms
  {
    key: "symptoms_list",
    section: "C",
    sectionTitle: "Reported Symptoms",
    prompt: "What symptoms are you experiencing?",
    helpText: "Select all that apply or type your own.",
    type: "multi_select",
    options: [
      { value: "Headache", label: "Headache" },
      { value: "Fever / Chills", label: "Fever / Chills" },
      { value: "Cough", label: "Cough" },
      { value: "Sore Throat", label: "Sore Throat" },
      { value: "Shortness of Breath", label: "Shortness of Breath" },
      { value: "Chest Discomfort", label: "Chest Discomfort" },
      { value: "Abdominal Pain", label: "Abdominal Pain" },
      { value: "Nausea / Vomiting", label: "Nausea / Vomiting" },
      { value: "Dizziness / Lightheadedness", label: "Dizziness / Lightheadedness" },
      { value: "Fatigue / Weakness", label: "Fatigue / Weakness" },
      { value: "Joint / Muscle Ache", label: "Joint / Muscle Ache" },
      { value: "Skin Rash / Itching", label: "Skin Rash / Itching" },
      { value: "Other", label: "Other" },
    ],
    required: true,
  },

  // Section D: Location
  {
    key: "symptom_location",
    section: "D",
    sectionTitle: "Location",
    prompt: "Where in your body are you experiencing the problem?",
    helpText: "Select the primary region or specify.",
    type: "single_select",
    options: [
      { value: "Head / Face", label: "Head / Face" },
      { value: "Throat / Neck", label: "Throat / Neck" },
      { value: "Chest", label: "Chest" },
      { value: "Abdomen", label: "Abdomen" },
      { value: "Upper Back", label: "Upper Back" },
      { value: "Lower Back", label: "Lower Back" },
      { value: "Arms / Hands", label: "Arms / Hands" },
      { value: "Legs / Feet", label: "Legs / Feet" },
      { value: "Skin / Generalized", label: "Skin / Generalized" },
      { value: "Not location specific", label: "Not location specific" },
    ],
    required: true,
  },

  // Section E: Onset
  {
    key: "symptom_onset",
    section: "E",
    sectionTitle: "Timeline & Onset",
    prompt: "When did you first notice the problem?",
    type: "single_select",
    options: [
      { value: "Today", label: "Today" },
      { value: "Yesterday", label: "Yesterday" },
      { value: "A few days ago", label: "A few days ago" },
      { value: "About a week ago", label: "About a week ago" },
      { value: "A few weeks ago", label: "A few weeks ago" },
      { value: "About a month ago", label: "About a month ago" },
      { value: "Several months or longer", label: "Several months or longer" },
      { value: "Not sure", label: "Not sure" },
    ],
    required: true,
  },
  {
    key: "onset_details",
    section: "E",
    sectionTitle: "Timeline & Onset",
    prompt: "Did anything specific trigger the onset, or did it start gradually?",
    placeholder: "e.g., Started suddenly after heavy lifting at work.",
    type: "text",
    required: false,
  },

  // Section F: Progression
  {
    key: "symptom_progression",
    section: "F",
    sectionTitle: "Progression",
    prompt: "Since it started, how has the problem changed?",
    type: "single_select",
    options: [
      { value: "Getting worse", label: "Getting worse" },
      { value: "Getting better", label: "Getting better" },
      { value: "About the same", label: "About the same" },
      { value: "Comes and goes", label: "Comes and goes" },
      { value: "Not sure", label: "Not sure" },
    ],
    required: true,
  },

  // Section G: Severity
  {
    key: "overall_severity",
    section: "G",
    sectionTitle: "Severity",
    prompt: "How much is this problem affecting you right now?",
    helpText: "0 = Not affecting me at all, 10 = Extremely severe / intolerable.",
    type: "severity_scale",
    min: 0,
    max: 10,
    minLabel: "0 - Not affecting me",
    maxLabel: "10 - Extremely severe",
    required: true,
  },

  // Section H: Pain
  {
    key: "has_pain",
    section: "H",
    sectionTitle: "Pain Assessment",
    prompt: "Are you experiencing pain?",
    type: "yes_no",
    required: true,
  },
  {
    key: "pain_rating",
    section: "H",
    sectionTitle: "Pain Assessment",
    prompt: "How would you rate the pain from 0 to 10?",
    helpText: "0 = No pain, 10 = Worst pain imaginable.",
    type: "pain_scale",
    min: 0,
    max: 10,
    minLabel: "0 - No pain",
    maxLabel: "10 - Worst pain",
    condition: { dependsOnKey: "has_pain", equals: "Yes" },
    required: true,
  },
  {
    key: "pain_character",
    section: "H",
    sectionTitle: "Pain Assessment",
    prompt: "How would you describe the pain?",
    type: "multi_select",
    options: [
      { value: "Sharp", label: "Sharp" },
      { value: "Dull ache", label: "Dull ache" },
      { value: "Burning", label: "Burning" },
      { value: "Throbbing", label: "Throbbing" },
      { value: "Cramping", label: "Cramping" },
      { value: "Pressure", label: "Pressure" },
      { value: "Shooting", label: "Shooting" },
      { value: "Other", label: "Other" },
      { value: "Not sure", label: "Not sure" },
    ],
    condition: { dependsOnKey: "has_pain", equals: "Yes" },
    required: false,
  },
  {
    key: "pain_pattern",
    section: "H",
    sectionTitle: "Pain Assessment",
    prompt: "Is the pain constant or does it come and go?",
    type: "single_select",
    options: [
      { value: "Constant", label: "Constant" },
      { value: "Comes and goes in waves", label: "Comes and goes in waves" },
      { value: "Triggered only by specific movements", label: "Triggered only by specific movements" },
      { value: "Not sure", label: "Not sure" },
    ],
    condition: { dependsOnKey: "has_pain", equals: "Yes" },
    required: false,
  },

  // Section I: Triggering Factors
  {
    key: "aggravating_factors",
    section: "I",
    sectionTitle: "Factors",
    prompt: "Have you noticed anything that makes the problem worse?",
    placeholder: "e.g., Bright lights, bending forward, cold weather, or 'Not sure'",
    type: "text",
    required: false,
  },

  // Section J: Relieving Factors
  {
    key: "relieving_factors",
    section: "J",
    sectionTitle: "Factors",
    prompt: "Have you noticed anything that makes it better?",
    placeholder: "e.g., Lying down in a dark room, warm compress, or 'Nothing noticed'",
    type: "text",
    required: false,
  },

  // Section K: Associated Symptoms
  {
    key: "associated_symptoms",
    section: "K",
    sectionTitle: "Associated Symptoms",
    prompt: "Have you noticed any other symptoms occurring with this problem?",
    placeholder: "e.g., Mild nausea when the headache peaks, or 'None noticed'",
    type: "text",
    required: false,
  },

  // Section L: Previous Episodes
  {
    key: "had_previous_episodes",
    section: "L",
    sectionTitle: "Previous Episodes",
    prompt: "Have you experienced something similar before?",
    type: "single_select",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
      { value: "Not sure", label: "Not sure" },
    ],
    required: true,
  },
  {
    key: "previous_episodes_details",
    section: "L",
    sectionTitle: "Previous Episodes",
    prompt: "What happened previously and how was it resolved?",
    placeholder: "e.g., Similar headache 6 months ago that lasted 2 days after taking paracetamol.",
    type: "textarea",
    condition: { dependsOnKey: "had_previous_episodes", equals: "Yes" },
    required: false,
  },

  // Section M: Treatments Tried
  {
    key: "treatments_tried",
    section: "M",
    sectionTitle: "Treatments Tried",
    prompt: "Have you tried anything for this problem already?",
    type: "multi_select",
    options: [
      { value: "Over-the-counter medicine", label: "Over-the-counter medicine" },
      { value: "Prescription medicine", label: "Prescription medicine" },
      { value: "Rest", label: "Rest" },
      { value: "Ice or Heat application", label: "Ice or Heat application" },
      { value: "Home remedy", label: "Home remedy" },
      { value: "Previous doctor visit", label: "Previous doctor visit" },
      { value: "Physical therapy", label: "Physical therapy" },
      { value: "None", label: "None" },
    ],
    required: true,
  },
  {
    key: "treatment_results",
    section: "M",
    sectionTitle: "Treatments Tried",
    prompt: "Did what you tried help? Describe the effect.",
    placeholder: "e.g., Took 500mg paracetamol yesterday, gave temporary relief for 2 hours.",
    type: "text",
    required: false,
  },

  // Section N: Medical Conditions
  {
    key: "existing_conditions",
    section: "N",
    sectionTitle: "Medical History",
    prompt: "Do you have any ongoing medical conditions the doctor should know about?",
    placeholder: "e.g., Hypertension, Type 2 Diabetes, Asthma, or 'None known'",
    type: "textarea",
    helpText: "Only list conditions you know of. Do not infer.",
    required: false,
  },

  // Section O: Surgeries / Hospitalizations
  {
    key: "surgeries_hospitalizations",
    section: "O",
    sectionTitle: "Past Procedures",
    prompt: "Have you had any major surgeries or hospital admissions?",
    placeholder: "e.g., Appendectomy in 2018, or 'None'",
    type: "textarea",
    required: false,
  },

  // Section P: Current Medications
  {
    key: "current_medications",
    section: "P",
    sectionTitle: "Medications & Supplements",
    prompt: "Are you currently taking any medicines, vitamins, or supplements?",
    placeholder: "e.g., Amlodipine 5mg daily, Vitamin D3 weekly, or 'None'",
    helpText: "List names and frequency if known. TriageAI does not make medication recommendations.",
    type: "textarea",
    required: false,
  },

  // Section Q: Allergies
  {
    key: "known_allergies",
    section: "Q",
    sectionTitle: "Allergies",
    prompt: "Do you have any known allergies (medicines, foods, environmental)?",
    placeholder: "e.g., Penicillin (skin hives), Peanuts, or 'No known allergies'",
    type: "textarea",
    required: true,
  },

  // Section R: Previous Consultations
  {
    key: "had_prior_consultation",
    section: "R",
    sectionTitle: "Prior Consultations",
    prompt: "Have you already consulted another healthcare professional about this specific problem?",
    type: "yes_no",
    required: true,
  },
  {
    key: "prior_consultation_details",
    section: "R",
    sectionTitle: "Prior Consultations",
    prompt: "When, what were you advised, and were any tests performed?",
    placeholder: "e.g., Saw a clinic doctor 4 days ago; was told to rest and get a blood test if fever persisted.",
    type: "textarea",
    condition: { dependsOnKey: "had_prior_consultation", equals: "Yes" },
    required: false,
  },

  // Section S: Medical Records
  {
    key: "has_medical_records",
    section: "S",
    sectionTitle: "Medical Records",
    prompt: "Do you have previous reports, prescriptions, scans, or lab results related to this problem?",
    type: "yes_no",
    required: true,
  },
  {
    key: "medical_records_notes",
    section: "S",
    sectionTitle: "Medical Records",
    prompt: "Describe what documents you have or intend to bring/upload",
    placeholder: "e.g., Blood test report from last month and previous prescription.",
    type: "text",
    condition: { dependsOnKey: "has_medical_records", equals: "Yes" },
    required: false,
  },

  // Section T: Effect on Daily Life
  {
    key: "daily_life_impact",
    section: "T",
    sectionTitle: "Impact on Daily Life",
    prompt: "How is this problem affecting your normal activities?",
    type: "single_select",
    options: [
      { value: "Not much", label: "Not much - Able to do regular work" },
      { value: "Slightly", label: "Slightly - Some discomfort during chores" },
      { value: "Moderately", label: "Moderately - Had to modify work or take breaks" },
      { value: "Significantly", label: "Significantly - Unable to attend work or school" },
      { value: "Unable to perform normal activities", label: "Unable to perform basic normal activities" },
    ],
    required: true,
  },

  // Section U: Patient Concern
  {
    key: "patient_concern",
    section: "U",
    sectionTitle: "Your Concerns",
    prompt: "Is there anything about this problem that particularly worries you?",
    placeholder: "e.g., Worried it might be a migraine or related to my blood pressure.",
    type: "textarea",
    required: false,
  },

  // Section V: Patient Goal
  {
    key: "consultation_goal",
    section: "V",
    sectionTitle: "Appointment Goals",
    prompt: "What would you most like the doctor to help you with during the appointment?",
    type: "multi_select",
    options: [
      { value: "Understand the cause of my symptoms", label: "Understand the cause of my symptoms" },
      { value: "Discuss symptom relief options", label: "Discuss symptom relief options" },
      { value: "Review previous medical reports", label: "Review previous medical reports" },
      { value: "Discuss medication options", label: "Discuss medication options" },
      { value: "Follow-up on an existing condition", label: "Follow-up on an existing condition" },
      { value: "Other", label: "Other" },
    ],
    required: true,
  },

  // Section W: Additional Information
  {
    key: "additional_info",
    section: "W",
    sectionTitle: "Additional Information",
    prompt: "Is there anything else you think the doctor should know before your appointment?",
    placeholder: "e.g., Any recent travel, family history, or questions you would like answered.",
    type: "textarea",
    required: false,
  },
];
