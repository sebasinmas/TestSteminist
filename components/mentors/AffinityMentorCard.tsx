import React, { useState } from 'react';
import type { AffinityResult, AffinityVariable } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Tag from '../common/Tag';
import { ChevronDownIcon, StarIcon, UsersIcon, LightBulbIcon, BriefcaseIcon, CalendarIcon, GlobeAltIcon, HeartIcon } from '../common/Icons';

interface AffinityMentorCardProps {
    result: AffinityResult;
    onViewProfile: (mentor: AffinityResult['mentor']) => void;
}

const AffinityVariableDetails: Record<AffinityVariable, { label: string; icon: React.ReactNode }> = {
    expertise: { label: 'Expertise', icon: <StarIcon className="w-5 h-5 text-yellow-500" /> },
    experienceLevel: { label: 'Nivel de Rol', icon: <BriefcaseIcon className="w-5 h-5 text-cyan" /> },
    communicationStyle: { label: 'Comunicación', icon: <UsersIcon className="w-5 h-5 text-lilac" /> },
    weeklyAvailability: { label: 'Disponibilidad', icon: <CalendarIcon className="w-5 h-5 text-green-500" /> },
    timezone: { label: 'Huso Horario', icon: <GlobeAltIcon className="w-5 h-5 text-blue-500" /> },
    motivations: { label: 'Motivaciones', icon: <HeartIcon className="w-5 h-5 text-magenta" /> },
};


const AffinityMentorCard: React.FC<AffinityMentorCardProps> = ({ result, onViewProfile }) => {
    const { mentor, papPercentage, breakdown } = result;
    const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
    
    const percentage = Math.round(papPercentage);
    const circumference = 2 * Math.PI * 45; // 2 * pi * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getMatchTypeColor = (matchType: 'Exacta' | 'Parcial' | 'Nula') => {
        switch (matchType) {
            case 'Exacta': return 'text-green-500';
            case 'Parcial': return 'text-yellow-500';
            case 'Nula': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50">
            <div className="flex items-start mb-4">
                <img src={mentor.avatarUrl} alt={mentor.name} className="w-20 h-20 rounded-full mr-4" />
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{mentor.name}</h3>
                    <p className="text-md text-primary">{mentor.title}</p>
                    <p className="text-sm text-muted-foreground">{mentor.company}</p>
                </div>
                 <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-border" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle
                            className="text-primary"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
                        />
                        <text className="text-xl font-bold fill-current text-foreground" x="50" y="50" dy=".3em" textAnchor="middle">
                            {`${percentage}%`}
                        </text>
                    </svg>
                    <p className="text-xs text-center text-muted-foreground -mt-1">Afinidad</p>
                </div>
            </div>
            
            <p className="text-sm text-foreground/80 mb-4 flex-grow">{mentor.bio}</p>
            
            <div className="mb-4">
                {mentor.expertise.slice(0, 3).map(tag => <Tag key={tag}>{tag}</Tag>)}
                {mentor.expertise.length > 3 && <Tag>+{mentor.expertise.length - 3} más</Tag>}
            </div>

            <div className="mt-auto pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-3">
                    <button 
                        onClick={() => setIsBreakdownVisible(!isBreakdownVisible)}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                        Ver desglose de afinidad
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isBreakdownVisible ? 'rotate-180' : ''}`} />
                    </button>
                    <Button onClick={() => onViewProfile(mentor)} size="sm">Ver Perfil</Button>
                </div>
                
                {isBreakdownVisible && (
                     <div className="mt-3 bg-secondary/50 p-3 rounded-lg space-y-2 animate-fade-in">
                        {Object.entries(breakdown).map(([key, value]) => {
                            const details = AffinityVariableDetails[key as AffinityVariable];
                            if (!details || !value) return null;
                            // FIX: Added type assertion for `value` because TypeScript incorrectly inferred it as 'unknown' within the map function.
                            const breakdownValue = value as { matchType: 'Exacta' | 'Parcial' | 'Nula'; score: number };
                            return (
                                <div key={key} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        {details.icon}
                                        <span className="font-medium">{details.label}</span>
                                    </div>
                                    <span className={`font-bold ${getMatchTypeColor(breakdownValue.matchType)}`}>{breakdownValue.matchType}</span>
                                </div>
                            )
                        })}
                         <style>{`
                            @keyframes fade-in {
                                from { opacity: 0; transform: translateY(-5px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            .animate-fade-in { animation: fade-in 0.3s ease-out; }
                        `}</style>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AffinityMentorCard;