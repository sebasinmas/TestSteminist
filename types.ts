export type Page = 'landing' | 'discover' | 'profile' | 'dashboard' | 'notifications' | 'settings' | 'profile_self' | 'admin_dashboard' | 'mentee_profile';

export type UserRole = 'mentee' | 'mentor' | 'admin';

export type Theme = 'light' | 'dark';

export type ConnectionStatus = 'none' | 'pending' | 'connected' | 'declined';

// Nuevos tipos para el cálculo de afinidad
export type ExperienceLevel = 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'C-Level';
export type CommunicationStyle = 'Directo' | 'Formal' | 'Casual' | 'Analítico';
export type TimezonePreference = 'Local' | 'Global' | 'Similar (±3h)';

export const ExperienceLevels: ExperienceLevel[] = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'C-Level'];
export const CommunicationStyles: CommunicationStyle[] = ['Directo', 'Formal', 'Casual', 'Analítico'];
export const TimezonePreferences: TimezonePreference[] = ['Local', 'Global', 'Similar (±3h)'];

export interface Mentor {
    id: number;
    name: string;
    title: string;
    company: string;
    bio: string;
    longBio: string;
    avatarUrl: string;
    rating: number;
    reviews: number;
    expertise: string[];
    availability: Record<string, string[]>;
    connectionStatus?: ConnectionStatus;
    maxMentees: number;
    // Campos para el Puntaje de Afinidad Ponderado (PAP)
    experienceLevel: ExperienceLevel;
    communicationStyle: CommunicationStyle;
    timezonePreference: TimezonePreference;
    weeklyAvailabilityHours: number;
    motivations: string[];
}

export interface Mentee {
    id: number;
    name: string;
    avatarUrl: string;
    title?: string;
    company?: string;
    bio?: string;
    expertise?: string[]; // Representa los objetivos de la mentee
    availability?: Record<string, string[]>;
    pronouns?: string;
    neurodivergence?: string;
    // Campos para el Puntaje de Afinidad Ponderado (PAP)
    experienceLevel?: ExperienceLevel;
    communicationStyle?: CommunicationStyle;
    timezonePreference?: TimezonePreference;
    weeklyAvailabilityHours?: number; // Horas que necesita/busca
    motivations?: string[];
}

// FIX: Added 'termination_requested' to SessionStatus to align with its usage in SessionCard.tsx.
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'needs_confirmation' | 'rescheduled' | 'termination_requested';

export interface Attachment {
    name: string;
    url: string; 
}

export interface MentorSurvey {
    preparation: 'excellent' | 'good' | 'average' | 'poor';
    engagement: 'excellent' | 'good' | 'average' | 'poor';
    outcome: string;
}

export interface Session {
    id: number;
    sessionNumber: number;
    date: string;
    time: string;
    duration: number;
    status: SessionStatus;
    topic: string;
    menteeGoals: string;
    rating?: number;
    feedback?: string;
    attachments?: Attachment[];
    mentorSurvey?: MentorSurvey;
}

export interface Mentorship {
    id: number;
    mentor: Mentor;
    mentee: Mentee;
    status: 'active' | 'completed' | 'termination_requested';
    sessions: Session[];
    startDate: string;
    terminationReason?: string;
}

export interface ConnectionRequest {
    id: number;
    mentor: Mentor;
    mentee: Mentee;
    status: 'pending' | 'accepted' | 'declined';
    motivationLetter: string;
}

export type AffinityVariable = 'expertise' | 'experienceLevel' | 'communicationStyle' | 'weeklyAvailability' | 'timezone' | 'motivations';

export type AffinityBreakdown = {
    [key in AffinityVariable]?: {
        score: number;
        matchType: 'Exacta' | 'Parcial' | 'Nula';
    }
};

export interface AffinityResult {
    mentor: Mentor;
    papTotal: number;
    papPercentage: number;
    breakdown: AffinityBreakdown;
}