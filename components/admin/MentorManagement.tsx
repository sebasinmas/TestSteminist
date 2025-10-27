import React, { useState } from 'react';
import type { Mentor } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';

interface MentorManagementProps {
    mentors: Mentor[];
    mentorMenteesCount: Record<number, number>;
    onUpdateMaxMentees: (mentorId: number, maxMentees: number) => void;
}

const MentorManagement: React.FC<MentorManagementProps> = ({ mentors, mentorMenteesCount, onUpdateMaxMentees }) => {
    const [editableCapacity, setEditableCapacity] = useState<Record<number, string>>({});

    const handleCapacityChange = (mentorId: number, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setEditableCapacity(prev => ({ ...prev, [mentorId]: numericValue }));
    };
    
    const handleSave = (mentorId: number) => {
        const value = editableCapacity[mentorId];
        if (value !== undefined && value !== '') {
            onUpdateMaxMentees(mentorId, parseInt(value, 10));
        }
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 text-foreground/80">Configurar Capacidad de Mentoras</h3>
            <Card className="p-0">
                <div className="max-h-[70vh] overflow-y-auto">
                    <ul className="divide-y divide-border">
                        {mentors.map(mentor => {
                            const currentMentees = mentorMenteesCount[mentor.id] || 0;
                            const isAtCapacity = currentMentees >= mentor.maxMentees;
                            
                            return (
                                <li key={mentor.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                        <img src={mentor.avatarUrl} alt={mentor.name} className="w-12 h-12 rounded-full" />
                                        <div>
                                            <p className="font-bold">{mentor.name}</p>
                                            <p className="text-sm text-muted-foreground">{mentor.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                                        <div className="flex-1 text-center">
                                            <p className={`font-bold text-lg ${isAtCapacity ? 'text-red-500' : 'text-foreground'}`}>
                                                {currentMentees} / {mentor.maxMentees}
                                            </p>
                                            <p className="text-sm text-muted-foreground">Mentoreadas Activas</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <input
                                                type="text"
                                                pattern="[0-9]*"
                                                value={editableCapacity[mentor.id] ?? mentor.maxMentees}
                                                onChange={(e) => handleCapacityChange(mentor.id, e.target.value)}
                                                className="w-16 p-2 border border-border rounded-md bg-input text-center"
                                                aria-label={`Capacidad máxima para ${mentor.name}`}
                                            />
                                            <Button size="sm" onClick={() => handleSave(mentor.id)}>Guardar</Button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default MentorManagement;
