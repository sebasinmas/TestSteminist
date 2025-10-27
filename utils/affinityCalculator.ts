import type { Mentor, Mentee, ExperienceLevel, AffinityResult, AffinityBreakdown, AffinityVariable } from '../types';

const weights: Record<AffinityVariable, number> = {
    expertise: 10,
    experienceLevel: 8,
    communicationStyle: 6,
    weeklyAvailability: 7,
    timezone: 5,
    motivations: 4,
};

const MAX_SCORE_PER_VARIABLE = 10;
export const MAX_PAP = Object.values(weights).reduce((sum, weight) => sum + (MAX_SCORE_PER_VARIABLE * weight), 0);

const experienceLevelHierarchy: Record<ExperienceLevel, number> = {
    'Junior': 1,
    'Mid-Level': 2,
    'Senior': 3,
    'Lead': 4,
    'C-Level': 5
};

// 1. Área de Expertise/Objetivo
const calculateExpertiseScore = (mentee: Mentee, mentor: Mentor): { score: number, matchType: 'Exacta' | 'Parcial' | 'Nula' } => {
    const menteeGoals = mentee.expertise || [];
    const mentorExpertise = mentor.expertise || [];
    const commonTopics = menteeGoals.filter(goal => mentorExpertise.includes(goal));

    if (commonTopics.length >= 2) return { score: 10, matchType: 'Exacta' };
    if (commonTopics.length === 1) return { score: 5, matchType: 'Parcial' };
    return { score: 1, matchType: 'Nula' };
};

// 2. Nivel de Experiencia
const calculateExperienceScore = (mentee: Mentee, mentor: Mentor): { score: number, matchType: 'Exacta' | 'Parcial' | 'Nula' } => {
    const menteeLevel = experienceLevelHierarchy[mentee.experienceLevel || 'Junior'];
    const mentorLevel = experienceLevelHierarchy[mentor.experienceLevel];
    
    // El match es ideal si la mentora está al menos 2 niveles por encima.
    if (mentorLevel - menteeLevel >= 2) return { score: 10, matchType: 'Exacta' };
    // Un nivel por encima sigue siendo muy bueno.
    if (mentorLevel - menteeLevel === 1) return { score: 7, matchType: 'Parcial' };
    // Mismo nivel o inferior no es ideal para mentoría.
    return { score: 1, matchType: 'Nula' };
};

// 3. Estilo de Comunicación
const calculateCommunicationStyleScore = (mentee: Mentee, mentor: Mentor): { score: number, matchType: 'Exacta' | 'Parcial' | 'Nula' } => {
    if (mentee.communicationStyle === mentor.communicationStyle) return { score: 10, matchType: 'Exacta' };
    return { score: 1, matchType: 'Nula' };
};

// 4. Disponibilidad Semanal
const calculateAvailabilityScore = (mentee: Mentee, mentor: Mentor): { score: number, matchType: 'Exacta' | 'Parcial' | 'Nula' } => {
    const menteeNeeds = mentee.weeklyAvailabilityHours || 0;
    const mentorHas = mentor.weeklyAvailabilityHours;
    
    if (mentorHas >= menteeNeeds) return { score: 10, matchType: 'Exacta' };
    if (mentorHas >= menteeNeeds * 0.5) return { score: 5, matchType: 'Parcial' };
    return { score: 1, matchType: 'Nula' };
};

// 5. Preferencia de Huso Horario
const calculateTimezoneScore = (mentee: Mentee, mentor: Mentor): { score: number, matchType: 'Exacta' | 'Parcial' | 'Nula' } => {
    const menteePref = mentee.timezonePreference;
    const mentorPref = mentor.timezonePreference;

    if (menteePref === mentorPref) return { score: 10, matchType: 'Exacta' };
    if (menteePref === 'Global' || mentorPref === 'Global') return { score: 7, matchType: 'Parcial' };
    if (menteePref === 'Similar (±3h)' && mentorPref === 'Local') return { score: 5, matchType: 'Parcial' };
    if (mentorPref === 'Similar (±3h)' && menteePref === 'Local') return { score: 5, matchType: 'Parcial' };
    return { score: 1, matchType: 'Nula' };
};

// 6. Motivación/Intereses Personales
const calculateMotivationScore = (mentee: Mentee, mentor: Mentor): { score: number, matchType: 'Exacta' | 'Parcial' | 'Nula' } => {
    const menteeMotivations = mentee.motivations || [];
    const mentorMotivations = mentor.motivations || [];
    const commonMotivations = menteeMotivations.filter(m => mentorMotivations.includes(m));

    if (commonMotivations.length >= 2) return { score: 10, matchType: 'Exacta' };
    if (commonMotivations.length === 1) return { score: 5, matchType: 'Parcial' };
    return { score: 1, matchType: 'Nula' };
};

export const calculateAffinity = (mentee: Mentee, mentor: Mentor): AffinityResult => {
    const breakdown: AffinityBreakdown = {
        expertise: calculateExpertiseScore(mentee, mentor),
        experienceLevel: calculateExperienceScore(mentee, mentor),
        communicationStyle: calculateCommunicationStyleScore(mentee, mentor),
        weeklyAvailability: calculateAvailabilityScore(mentee, mentor),
        timezone: calculateTimezoneScore(mentee, mentor),
        motivations: calculateMotivationScore(mentee, mentor),
    };

    const papTotal = Object.entries(breakdown).reduce((total, [key, result]) => {
        const weight = weights[key as AffinityVariable];
        return total + (result.score * weight);
    }, 0);

    const papPercentage = (papTotal / MAX_PAP) * 100;

    return {
        mentor,
        papTotal,
        papPercentage,
        breakdown
    };
};
