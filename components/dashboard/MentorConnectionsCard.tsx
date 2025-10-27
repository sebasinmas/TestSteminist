import React from 'react';
import type { Mentee, Page } from '../../types';
import Card from '../common/Card';

interface MentorConnectionsCardProps {
    mentees: Mentee[];
    navigateTo: (page: Page, data: Mentee) => void;
}

const MentorConnectionsCard: React.FC<MentorConnectionsCardProps> = ({ mentees, navigateTo }) => {
    
    const SubtitleWithTooltip: React.FC<{ mentee: Mentee }> = ({ mentee }) => {
        const info = [mentee.pronouns, mentee.neurodivergence].filter(Boolean).join(' | ');
        
        if (!info) {
            return null;
        }

        // Simple check to see if we should truncate
        const needsTooltip = info.length > 25;

        return (
            <div className="relative group text-sm text-muted-foreground max-w-[150px]">
                <p className="truncate">{info}</p>
                {needsTooltip && (
                    <div className="absolute hidden group-hover:block bottom-full mb-1 w-max max-w-xs p-2 text-xs bg-popover text-foreground border border-border rounded-md shadow-lg z-10 break-words">
                        {info}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card>
            <h3 className="text-lg font-bold mb-4">Mis Mentoreadas ({mentees.length})</h3>
            {mentees.length > 0 ? (
                 <ul className="space-y-4">
                    {mentees.map(mentee => (
                        <li key={mentee.id} className="flex items-start space-x-3">
                            <button onClick={() => navigateTo('mentee_profile', mentee)} className="flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                <img src={mentee.avatarUrl} alt={mentee.name} className="w-10 h-10 rounded-full" />
                            </button>
                            <div className="flex flex-col items-start">
                                <button onClick={() => navigateTo('mentee_profile', mentee)} className="font-semibold text-left hover:underline focus:outline-none focus:underline">
                                    {mentee.name}
                                </button>
                                <SubtitleWithTooltip mentee={mentee} />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No tienes mentoreadas activas.</p>
            )}
        </Card>
    );
};

export default MentorConnectionsCard;