import React, { useState, useMemo } from 'react';
import type { UserRole, Mentor, Mentee, Page, Mentorship, Session, MentorSurvey, Attachment } from '../types';
import { POSITIVE_AFFIRMATIONS } from '../constants';
import AffirmationCard from '../components/dashboard/AffirmationCard';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import MentorshipProgress from '../components/dashboard/MentorshipProgress';
import SchedulingModal from '../components/scheduling/SchedulingModal';
import MentorSurveyModal from '../components/dashboard/MentorSurveyModal';

interface DashboardPageProps {
    userRole: UserRole;
    currentUser: Mentor | Mentee;
    mentorships: Mentorship[];
    navigateTo: (page: Page, data?: Mentor | Mentee) => void;
    addSession: (mentorshipId: number, newSession: Omit<Session, 'id' | 'sessionNumber'>) => void;
    updateMentorshipSession: (mentorshipId: number, sessionId: number, updates: Partial<Session>) => void;
    addAttachmentToSession: (mentorshipId: number, sessionId: number, attachment: Attachment) => void;
    addSurveyToSession: (mentorshipId: number, sessionId: number, survey: MentorSurvey) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
    const { userRole, currentUser, mentorships, navigateTo, addSession } = props;
    const isMentor = userRole === 'mentor';
    
    const [isScheduling, setIsScheduling] = useState(false);
    const [activeMentorship, setActiveMentorship] = useState<Mentorship | null>(null);

    const [sessionForSurvey, setSessionForSurvey] = useState<{mentorshipId: number, session: Session} | null>(null);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

    const myMentorships = useMemo(() => {
        return mentorships.filter(m => 
            isMentor ? m.mentor.id === currentUser.id : m.mentee.id === currentUser.id
        );
    }, [mentorships, currentUser, isMentor]);

    const randomAffirmation = useMemo(() => POSITIVE_AFFIRMATIONS[Math.floor(Math.random() * POSITIVE_AFFIRMATIONS.length)], []);

    const handleScheduleClick = (mentorship: Mentorship) => {
        setActiveMentorship(mentorship);
        setIsScheduling(true);
    };

    const handleSessionBooked = (session: Omit<Session, 'id' | 'sessionNumber'>) => {
        if (activeMentorship) {
            addSession(activeMentorship.id, session);
        }
        setIsScheduling(false);
        setActiveMentorship(null);
    };

    const handleOpenSurvey = (mentorshipId: number, session: Session) => {
        setSessionForSurvey({ mentorshipId, session });
        setIsSurveyModalOpen(true);
    };

    const handleSurveySubmit = (surveyData: MentorSurvey) => {
        if (sessionForSurvey) {
            props.addSurveyToSession(sessionForSurvey.mentorshipId, sessionForSurvey.session.id, surveyData);
        }
        setIsSurveyModalOpen(false);
        setSessionForSurvey(null);
    };


    const WelcomeHeader = () => (
         <div className="mb-8">
            <h1 className="text-4xl font-bold">
                ¡Hola de nuevo, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Gestiona tus mentorías y sigue tu progreso.</p>
        </div>
    );
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <WelcomeHeader />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-semibold">Mis Mentorías Activas</h2>
                    {myMentorships.filter(m => m.status === 'active').length > 0 ? (
                        myMentorships.filter(m => m.status === 'active').map(m => (
                            <MentorshipProgress 
                                key={m.id}
                                mentorship={m}
                                userRole={userRole}
                                onScheduleSession={() => handleScheduleClick(m)}
                                onUpdateSession={props.updateMentorshipSession}
                                onAddAttachment={props.addAttachmentToSession}
                                onCompleteSession={handleOpenSurvey}
                            />
                        ))
                    ) : (
                        <Card>
                            <div className="text-center py-8">
                                <h3 className="text-xl font-semibold">Todo listo para empezar</h3>
                                {!isMentor ? (
                                    <>
                                        <p className="text-muted-foreground mt-2 mb-4">Aún no tienes mentorías activas. ¡Encuentra una mentora para comenzar!</p>
                                        <Button onClick={() => navigateTo('discover')}>Descubrir Mentoras</Button>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground mt-2">Cuando aceptes una solicitud de conexión, aparecerá aquí.</p>
                                )}
                            </div>
                        </Card>
                    )}

                    <h2 className="text-2xl font-semibold mt-10">Mentorías Completadas</h2>
                     {myMentorships.filter(m => m.status === 'completed').length > 0 ? (
                        myMentorships.filter(m => m.status === 'completed').map(m => (
                           <MentorshipProgress 
                                key={m.id}
                                mentorship={m}
                                userRole={userRole}
                                onScheduleSession={() => {}}
                                onUpdateSession={() => {}}
                                onAddAttachment={() => {}}
                                onCompleteSession={() => {}}
                            />
                        ))
                    ) : (
                        <Card><p className="text-muted-foreground">Aún no has completado ninguna mentoría.</p></Card>
                    )}
                </div>
                <div className="space-y-6 sticky top-28">
                    <AffirmationCard affirmation={randomAffirmation} />
                </div>
            </div>

            {activeMentorship && (
                <SchedulingModal
                    mentor={activeMentorship.mentor}
                    isOpen={isScheduling}
                    onClose={() => setIsScheduling(false)}
                    onSessionBook={handleSessionBooked}
                />
            )}
            
            {sessionForSurvey && isMentor && (
                <MentorSurveyModal
                    isOpen={isSurveyModalOpen}
                    onClose={() => setIsSurveyModalOpen(false)}
                    onSubmit={handleSurveySubmit}
                />
            )}

        </div>
    );
};

export default DashboardPage;