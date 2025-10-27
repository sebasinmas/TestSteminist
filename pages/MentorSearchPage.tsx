import React, { useMemo } from 'react';
import type { Mentor, Mentee, Page, AffinityResult } from '../types';
import { calculateAffinity, MAX_PAP } from '../utils/affinityCalculator';
import AffinityMentorCard from '../components/mentors/AffinityMentorCard';

interface MentorSearchPageProps {
    mentors: Mentor[];
    currentUser: Mentee;
    navigateTo: (page: Page, mentor?: Mentor) => void;
}

const MentorSearchPage: React.FC<MentorSearchPageProps> = ({ mentors, currentUser, navigateTo }) => {
    
    const VISIBILITY_THRESHOLD = 0.60; // 60%

    const affinityResults = useMemo(() => {
        // 1. Calculate PAP for all mentors
        const allResults: AffinityResult[] = mentors.map(mentor => calculateAffinity(currentUser, mentor));
        
        // 2. Filter by visibility threshold
        const visibleResults = allResults.filter(result => result.papTotal >= MAX_PAP * VISIBILITY_THRESHOLD);

        // 3. Sort by the highest PAP score
        const sortedResults = visibleResults.sort((a, b) => b.papTotal - a.papTotal);
        
        return sortedResults;
    }, [mentors, currentUser]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">Descubre tu Mentora Ideal</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Hemos analizado tu perfil para encontrar las mentoras con mayor afinidad para ti, ordenadas de mayor a menor compatibilidad.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {affinityResults.length > 0 ? (
                    affinityResults.map(result => (
                        <AffinityMentorCard 
                            key={result.mentor.id} 
                            result={result} 
                            onViewProfile={() => navigateTo('profile', result.mentor)} 
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center bg-card border border-border rounded-lg p-12">
                         <h2 className="text-2xl font-semibold mb-2">No se encontraron coincidencias</h2>
                         <p className="text-muted-foreground">
                            Intenta ajustar tus objetivos o áreas de interés en tu perfil para ampliar la búsqueda.
                         </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorSearchPage;