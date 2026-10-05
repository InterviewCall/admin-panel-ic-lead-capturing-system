// Dummy question bank used to build answers for the mock submissions.
// Remove together with the other files in src/mocks once the APIs are connected.
type QuestionTemplate = {
    text: string;
    // Ordered from the lowest to the highest scoring option.
    options: [string, string, string];
};

export const QUESTION_BANK: Record<string, QuestionTemplate> = {
    yoe: {
        text: 'How many years of experience do you have?',
        options: ['0 to 2 years', '2 to 4 years', '4 to 6 years'],
    },
    currentCtc: {
        text: 'What is your current CTC?',
        options: ['Under ₹6 LPA', '₹6 to 12 LPA', '₹12 to 18 LPA'],
    },
    jobSearchSituation: {
        text: 'Which best describes your job search?',
        options: ['Just exploring', 'Applying, few interview calls', 'Applying actively, interviews not converting'],
    },
    mainGap: {
        text: 'What is the biggest gap holding you back?',
        options: ['Not sure yet', 'DSA practice', 'DSA and system design'],
    },
    targetRoleType: {
        text: 'What role are you targeting?',
        options: ['Any tech role', 'Senior engineer', 'SDE-2 at a product company'],
    },
    growthSituation: {
        text: 'How would you describe your growth right now?',
        options: ['Growing steadily', 'Slowing down', 'Same salary band for 2+ years'],
    },
    growthTarget: {
        text: 'Where do you want to be in 12 months?',
        options: ['Not decided yet', '25% higher pay', '₹30 LPA+ at a product company'],
    },
    aiConcern: {
        text: 'What worries you most about AI?',
        options: ['Not worried', 'My skills becoming outdated', 'My role being replaced'],
    },
    careerSituation: {
        text: 'Where is your career right now?',
        options: ['Comfortable', 'Plateauing', 'At risk of being left behind'],
    },
    urgency: {
        text: 'How urgent is this for you?',
        options: ['Just exploring', 'Within 3 months', 'Starting within 30 days'],
    },
    investmentReadiness: {
        text: 'Are you ready to invest in structured preparation?',
        options: ['Not right now', 'Maybe, I need details', 'Yes, if the program fits'],
    },
    notes: {
        text: 'Anything else you want us to know? (optional)',
        options: ['', '', ''],
    },
};

export type StepTemplate = {
    stepNo: number;
    title: string;
    keys: string[];
};

export const FORM_STEP_TEMPLATES: Record<string, StepTemplate[]> = {
    'job-switch': [
        { stepNo: 1, title: 'Your background', keys: ['yoe', 'currentCtc'] },
        { stepNo: 2, title: 'Where you stand today', keys: ['jobSearchSituation', 'mainGap', 'targetRoleType'] },
        { stepNo: 3, title: 'Readiness', keys: ['urgency', 'investmentReadiness', 'notes'] },
    ],
    'salary-stagnation': [
        { stepNo: 1, title: 'Your background', keys: ['yoe', 'currentCtc'] },
        { stepNo: 2, title: 'Where you stand today', keys: ['growthSituation', 'mainGap', 'growthTarget'] },
        { stepNo: 3, title: 'Readiness', keys: ['urgency', 'investmentReadiness', 'notes'] },
    ],
    'ai-fear': [
        { stepNo: 1, title: 'Your background', keys: ['yoe', 'currentCtc'] },
        { stepNo: 2, title: 'Where you stand today', keys: ['aiConcern', 'careerSituation'] },
        { stepNo: 3, title: 'Readiness', keys: ['urgency', 'investmentReadiness', 'notes'] },
    ],
};
