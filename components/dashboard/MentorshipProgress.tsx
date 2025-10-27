import React, { useRef } from 'react';
import type { Mentorship, UserRole, Session, Attachment } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from '../common/Icons';

interface MentorshipProgressProps {
    mentorship: Mentorship;
    userRole: UserRole;
    onScheduleSession: () => void;
    onUpdateSession: (mentorshipId: number, sessionId: number, updates: Partial<Session>) => void;
    onAddAttachment: (mentorshipId: number, sessionId: number, attachment: Attachment) => void;
    onCompleteSession: (mentorshipId: number, session: Session) => void;
}

const MentorshipProgress: React.FC<MentorshipProgressProps> = ({ mentorship, userRole, onScheduleSession, onUpdateSession, onAddAttachment, onCompleteSession }) => {
    const isMentor = userRole === 'mentor';
    const otherParty = isMentor ? mentorship.mentee : mentorship.mentor;
    const completedSessions = mentorship.sessions.filter(s => s.status === 'completed').length;
    const fileInputRef = useRef<HTMLInputElement>(null);
    let activeSession: Session | undefined = mentorship.sessions.find(s => s.status === 'confirmed' || s.status === 'pending');
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeSession) {
            const file = e.target.files[0];
            const newAttachment: Attachment = { name: file.name, url: '#' }; // Mock URL
            onAddAttachment(mentorship.id, activeSession.id, newAttachment);
        }
    };
    
    const renderSessionStep = (sessionNumber: number) => {
        const session = mentorship.sessions.find(s => s.sessionNumber === sessionNumber);
        const isCompleted = session?.status === 'completed';
        const isConfirmed = session?.status === 'confirmed';
        const isNext = completedSessions + 1 === sessionNumber;

        let statusText = 'Por Agendar';
        if (isCompleted) statusText = 'Completada';
        else if (isConfirmed) statusText = 'Agendada';
        
        return (
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${isCompleted ? 'bg-green-500' : isNext ? 'bg-primary' : 'bg-border'}`}>
                   {isCompleted ? <CheckCircleIcon className="w-5 h-5 text-white" /> : <span className={`font-bold ${isNext ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{sessionNumber}</span>}
                </div>
                <div>
                    <h4 className="font-semibold">Sesión {sessionNumber}</h4>
                    <p className="text-sm text-muted-foreground">{statusText}</p>
                </div>
            </div>
        );
    };

    const renderActions = () => {
        if (mentorship.status !== 'active') return null;

        if (activeSession && activeSession.status === 'confirmed') {
            return (
                 <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>Adjuntar Archivo</Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    {isMentor && <Button size="sm" onClick={() => onCompleteSession(mentorship.id, activeSession!)}>Marcar como Completada</Button>}
                </div>
            );
        }
        
        if (completedSessions < 3 && !activeSession && !isMentor) {
             return <Button size="sm" onClick={onScheduleSession}>Agendar Sesión {completedSessions + 1}</Button>;
        }

        return null;
    };

    return (
        <Card>
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-border pb-4 mb-4">
                 <div className="flex items-center space-x-4">
                    <img src={otherParty.avatarUrl} alt={otherParty.name} className="w-16 h-16 rounded-full" />
                    <div>
                        <p className="text-sm text-muted-foreground">{isMentor ? 'Mentoreada' : 'Mentora'}</p>
                        <h3 className="text-xl font-bold">{otherParty.name}</h3>
                        {'title' in otherParty && <p className="text-primary">{otherParty.title}</p>}
                    </div>
                </div>
                {mentorship.status === 'completed' && (
                    <div className="mt-4 md:mt-0 text-center md:text-right">
                        <span className="inline-flex items-center gap-2 text-green-600 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full text-sm font-semibold">
                            <CheckCircleIcon /> Mentoría Completada
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progress Tracker */}
                <div className="space-y-4">
                    <h4 className="font-semibold">Progreso de la Mentoría</h4>
                    <div className="flex flex-col space-y-4">
                        {renderSessionStep(1)}
                        {renderSessionStep(2)}
                        {renderSessionStep(3)}
                    </div>
                </div>

                {/* Next Session Details & Actions */}
                <div className="bg-secondary p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Próxima Sesión</h4>
                    {activeSession ? (
                        <div className="space-y-3">
                            <p className="font-bold">{activeSession.topic}</p>
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="flex items-center gap-1"><CalendarIcon /> {new Date(activeSession.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><ClockIcon /> {activeSession.time}</span>
                            </div>
                            {activeSession.attachments && activeSession.attachments.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-semibold">Archivos:</h5>
                                    <ul className="list-disc list-inside text-sm">
                                        {activeSession.attachments.map(f => <li key={f.name}>{f.name}</li>)}
                                    </ul>
                                </div>
                            )}
                            <div className="pt-3 border-t border-border/50">{renderActions()}</div>
                        </div>
                    ) : (
                         <div className="space-y-3">
                             <p className="text-muted-foreground">No hay ninguna sesión agendada.</p>
                             <div className="pt-3">{renderActions()}</div>
                         </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default MentorshipProgress;
