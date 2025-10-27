
import React, { useMemo, useState } from 'react';
import type { Session, ConnectionRequest, Mentor, Mentee, Mentorship } from '../types';
import Card from '../components/common/Card';
import MetricsCard from '../components/admin/MetricsCard';
import AdminRequestCard from '../components/admin/AdminRequestCard';
import Button from '../components/common/Button';
import { UsersIcon, BriefcaseIcon, StarIcon, TrendingUpIcon } from '../components/common/Icons';
import AnalyticsDetailModal from '../components/admin/AnalyticsDetailModal';
import Tabs from '../components/common/Tabs';
import MentorManagement from '../components/admin/MentorManagement';
import { PieChart } from '../components/admin/Charts';

interface AdminDashboardPageProps {
    mentorships: Mentorship[];
    requests: ConnectionRequest[];
    mentors: Mentor[];
    updateConnectionStatus: (requestId: number, newStatus: 'accepted' | 'declined') => void;
    updateMentorMaxMentees: (mentorId: number, maxMentees: number) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ mentorships, requests, mentors, updateConnectionStatus, updateMentorMaxMentees }) => {
    
    const [selectedMentorship, setSelectedMentorship] = useState<Mentorship | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleViewDetails = (mentorship: Mentorship) => {
        setSelectedMentorship(mentorship);
        setIsDetailModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedMentorship(null);
    };
    
    const allSessions = useMemo(() => mentorships.flatMap(m => m.sessions), [mentorships]);

    const metrics = useMemo(() => {
        const completedSessions = allSessions.filter(s => s.status === 'completed' && s.rating);
        const totalRatings = completedSessions.reduce((acc, s) => acc + (s.rating || 0), 0);
        const avgRating = completedSessions.length > 0 ? (totalRatings / completedSessions.length).toFixed(2) : 'N/A';
        const uniqueMentees = new Set(mentorships.map(m => m.mentee.id)).size;

        return {
            totalMentees: uniqueMentees,
            activeMentorships: mentorships.filter(m => m.status === 'active').length,
            completedMentorships: mentorships.filter(m => m.status === 'completed').length,
            avgRating: avgRating,
        };
    }, [mentorships, allSessions]);

    const pendingRequests = useMemo(() => requests.filter(r => r.status === 'pending'), [requests]);
    const terminationRequests = useMemo(() => mentorships.filter(s => s.status === 'termination_requested'), [mentorships]);
    
    const mentorMenteesCount = useMemo(() => {
        const counts: Record<number, number> = {};
        mentorships.filter(m => m.status === 'active').forEach(m => {
            counts[m.mentor.id] = (counts[m.mentor.id] || 0) + 1;
        });
        return counts;
    }, [mentorships]);

    const tabs = ["Métricas", "Solicitudes", "Gestión de Mentoras", "Mentorías Activas"];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const mentorshipStatusData = useMemo(() => {
        return [
            { label: 'Activas', value: mentorships.filter(m => m.status === 'active').length, color: 'rgb(var(--primary))' },
            { label: 'Completadas', value: mentorships.filter(m => m.status === 'completed').length, color: 'rgb(var(--cyan))' },
            { label: 'Terminación Solicitada', value: mentorships.filter(m => m.status === 'termination_requested').length, color: 'rgb(var(--magenta))' }
        ].filter(d => d.value > 0);
    }, [mentorships]);
    
    const requestStatusData = useMemo(() => {
        const acceptedCount = requests.filter(r => r.status === 'accepted').length;
        // Also count connections from newly created mentorships that might not be in the initial 'requests' array with 'accepted' status
        const mentorshipConnections = mentorships.length;

        return [
            { label: 'Pendientes', value: requests.filter(r => r.status === 'pending').length, color: 'rgb(var(--lilac))' },
            { label: 'Aceptadas', value: Math.max(acceptedCount, mentorshipConnections), color: 'rgb(var(--primary))' },
            { label: 'Rechazadas', value: requests.filter(r => r.status === 'declined').length, color: 'rgb(var(--muted))' }
        ].filter(d => d.value > 0);
    }, [requests, mentorships]);


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8">Panel de Administrador</h1>
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mt-8">
                {activeTab === "Métricas" && (
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricsCard title="Total de Mentoreadas" value={metrics.totalMentees.toString()} icon={<UsersIcon className="w-8 h-8"/>} />
                            <MetricsCard title="Mentorías Activas" value={metrics.activeMentorships.toString()} icon={<BriefcaseIcon className="w-8 h-8"/>} />
                            <MetricsCard title="Mentorías Completadas" value={metrics.completedMentorships.toString()} icon={<TrendingUpIcon className="w-8 h-8"/>} />
                            <MetricsCard title="Calificación Promedio" value={metrics.avgRating} icon={<StarIcon className="w-8 h-8"/>} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PieChart title="Estado de Mentorías" data={mentorshipStatusData} />
                            <PieChart title="Estado de Solicitudes de Conexión" data={requestStatusData} />
                        </div>
                    </div>
                )}
                
                {activeTab === "Solicitudes" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground/80">Solicitudes de Mentoría Pendientes ({pendingRequests.length})</h3>
                            {pendingRequests.length > 0 ? (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {pendingRequests.map(req => (
                                    <AdminRequestCard key={req.id} request={req} onStatusChange={updateConnectionStatus} mentorCurrentMentees={mentorMenteesCount[req.mentor.id] || 0} />
                                ))}
                                </div>
                            ) : (
                                <Card><p className="text-muted-foreground">No hay solicitudes pendientes.</p></Card>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-foreground/80">Solicitudes de Terminación ({terminationRequests.length})</h3>
                            {terminationRequests.length > 0 ? (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {terminationRequests.map(m => (
                                    <Card key={m.id}>
                                        <p className="font-semibold">Mentora: {m.mentor.name}</p>
                                        <p className="text-sm">Mentoreada: {m.mentee.name}</p>
                                        {m.terminationReason && (
                                            <div className="mt-2 pt-2 border-t border-border">
                                                <h4 className="font-semibold text-sm mb-1">Razón para la Terminación:</h4>
                                                <p className="text-sm text-foreground/80 bg-secondary p-2 rounded-md italic">"{m.terminationReason}"</p>
                                            </div>
                                        )}
                                        <div className="flex gap-2 mt-4">
                                            {/* Logic to update mentorship status would go here */}
                                            <Button size="sm">Confirmar</Button>
                                            <Button size="sm" variant="secondary">Denegar</Button>
                                        </div>
                                    </Card>
                                ))}
                                </div>
                            ) : (
                                <Card><p className="text-muted-foreground">No hay solicitudes de terminación.</p></Card>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "Gestión de Mentoras" && (
                    <MentorManagement mentors={mentors} mentorMenteesCount={mentorMenteesCount} onUpdateMaxMentees={updateMentorMaxMentees} />
                )}

                {activeTab === "Mentorías Activas" && (
                     <div>
                        <h3 className="text-xl font-semibold mb-4 text-foreground/80">Todas las Mentorías Activas ({metrics.activeMentorships})</h3>
                        <div className="space-y-4">
                            {mentorships.filter(m => m.status === 'active').map(m => (
                                <Card key={m.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p><strong>Mentora:</strong> {m.mentor.name}</p>
                                        <p><strong>Mentoreada:</strong> {m.mentee.name}</p>
                                        <p className="text-sm text-muted-foreground">Progreso: {m.sessions.filter(s => s.status === 'completed').length} de 3 sesiones completadas</p>
                                    </div>
                                    <Button size="sm" variant="secondary" onClick={() => handleViewDetails(m)}>Ver Detalles</Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            
            <AnalyticsDetailModal 
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                mentorship={selectedMentorship}
            />

        </div>
    );
};

export default AdminDashboardPage;
