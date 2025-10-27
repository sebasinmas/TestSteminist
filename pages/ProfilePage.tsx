import React, { useState, useRef } from 'react';
import type { Mentee, Mentor } from '../types';
import { ExperienceLevels, CommunicationStyles, TimezonePreferences } from '../types';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag';
import { PencilIcon, CameraIcon, XIcon } from '../components/common/Icons';
import AvailabilityCalendarModal from '../components/scheduling/AvailabilityCalendarModal';

interface ProfilePageProps {
    user: Mentee | Mentor;
    isPublicView?: boolean;
    onUpdateProfile?: (updatedUser: Mentee | Mentor) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, isPublicView = false, onUpdateProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(user);
    const [newExpertise, setNewExpertise] = useState('');
    const [newMotivation, setNewMotivation] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const isMentor = 'reviews' in profileData;


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if(event.target?.result) {
                    setProfileData(prev => ({ ...prev, avatarUrl: event.target.result as string }));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const addTag = (type: 'expertise' | 'motivations') => {
        const value = type === 'expertise' ? newExpertise : newMotivation;
        const setter = type === 'expertise' ? setNewExpertise : setNewMotivation;
        
        if (value && profileData[type] && !profileData[type]!.includes(value)) {
            setProfileData(prev => ({...prev, [type]: [...(prev[type] || []), value]}));
            setter('');
        }
    };
    
    const removeTag = (type: 'expertise' | 'motivations', tagToRemove: string) => {
        setProfileData(prev => ({...prev, [type]: (prev[type] || []).filter(tag => tag !== tagToRemove)}));
    };


    const handleAvailabilitySave = (newAvailability: Record<string, string[]>) => {
        const cleanedAvailability: Record<string, string[]> = {};
        Object.entries(newAvailability).forEach(([date, times]) => {
            if (times.length > 0) {
                cleanedAvailability[date] = times.sort();
            }
        });
        setProfileData(prev => ({ ...prev, availability: cleanedAvailability }));
        setIsCalendarOpen(false);
    };

    const handleSave = () => {
        if (onUpdateProfile) {
            onUpdateProfile(profileData);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setProfileData(user); // Reset changes
        setIsEditing(false);
    };
    
    const renderSelect = (name: keyof (Mentor | Mentee), label: string, options: readonly string[]) => (
         <div>
            <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
            <select
                id={name}
                name={name}
                value={profileData[name] as string || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-border rounded-md bg-input text-foreground"
            >
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </div>
    );
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="sticky top-28 bg-card p-8 rounded-lg border border-border text-center">
                        <div className="relative w-40 h-40 mx-auto mb-4 group">
                            <img src={profileData.avatarUrl} alt={profileData.name} className="w-40 h-40 rounded-full object-cover" />
                            {isEditing && (
                                <>
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => fileInputRef.current?.click()} className="text-white">
                                            <CameraIcon className="w-10 h-10" />
                                        </button>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                                </>
                            )}
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleInputChange}
                                className="w-full text-center text-3xl font-bold bg-input border border-border rounded-md p-2"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold">{profileData.name}</h1>
                        )}
                        {isEditing ? (
                            <input
                                type="text"
                                name="title"
                                value={profileData.title || ''}
                                onChange={handleInputChange}
                                className="w-full text-center text-lg text-primary bg-input border border-border rounded-md p-2 mt-2"
                            />
                        ) : (
                            <p className="text-lg text-primary">{profileData.title}</p>
                        )}
                        {isEditing ? (
                             <input
                                type="text"
                                name="company"
                                value={profileData.company || ''}
                                onChange={handleInputChange}
                                className="w-full text-center text-md text-muted-foreground bg-input border border-border rounded-md p-2 mt-2"
                            />
                        ) : (
                             <p className="text-md text-muted-foreground mb-4">{profileData.company}</p>
                        )}

                        {isMentor && (
                            <div className="text-lg my-4">
                                <span className="font-bold text-yellow-500">★ {(profileData as Mentor).rating.toFixed(1)}</span>
                                <span className="text-muted-foreground"> ({(profileData as Mentor).reviews} reseñas)</span>
                            </div>
                        )}
                       
                        {!isEditing && !isPublicView && (
                             <Button onClick={() => setIsEditing(true)} size="lg" className="w-full mt-6 flex items-center justify-center gap-2">
                                <PencilIcon /> Editar Perfil
                            </Button>
                        )}
                        {isEditing && (
                            <div className="flex flex-col space-y-2 mt-6">
                                <Button onClick={handleSave} size="lg" className="w-full">Guardar Cambios</Button>
                                <Button onClick={handleCancel} variant="secondary" className="w-full">Cancelar</Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">Sobre Mí</h2>
                        {isEditing ? (
                            <textarea
                                name={isMentor ? 'longBio' : 'bio'}
                                value={isMentor ? (profileData as Mentor).longBio : (profileData as Mentee).bio || ''}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full text-lg text-foreground/90 whitespace-pre-line bg-input border border-border rounded-md p-3"
                            />
                        ) : (
                            <p className="text-lg text-foreground/90 whitespace-pre-line">{isMentor ? (profileData as Mentor).longBio : (profileData as Mentee).bio}</p>
                        )}
                    </div>

                    {!isMentor && !isPublicView && (
                         <div className="bg-card p-6 rounded-lg border border-border">
                            <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">Información Confidencial</h2>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="pronouns" className="block text-sm font-medium mb-1">Pronombres</label>
                                        <input
                                            type="text"
                                            id="pronouns"
                                            name="pronouns"
                                            value={(profileData as Mentee).pronouns || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                                            placeholder="Ej: Ella, Elle"
                                        />
                                    </div>
                                     <div>
                                        <label htmlFor="neurodivergence" className="block text-sm font-medium mb-1">Neurodivergencia (opcional)</label>
                                        <input
                                            type="text"
                                            id="neurodivergence"
                                            name="neurodivergence"
                                            value={(profileData as Mentee).neurodivergence || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                                            placeholder="Ej: TDAH, Espectro Autista"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Esta información es opcional y solo será visible para tu mentora confirmada y los administradores de la plataforma para ayudar a proporcionar una experiencia de apoyo.</p>
                                </div>
                            ) : (
                                 <div className="text-lg text-foreground/90 space-y-2">
                                    <p><strong>Pronombres:</strong> {(profileData as Mentee).pronouns || 'No especificado'}</p>
                                    <p><strong>Neurodivergencia:</strong> {(profileData as Mentee).neurodivergence || 'No especificado'}</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">Preferencias de Mentoría</h2>
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderSelect('experienceLevel', 'Nivel de Experiencia', ExperienceLevels)}
                                {renderSelect('communicationStyle', 'Estilo de Comunicación', CommunicationStyles)}
                                {renderSelect('timezonePreference', 'Preferencia de Huso Horario', TimezonePreferences)}
                                <div>
                                    <label htmlFor="weeklyAvailabilityHours" className="block text-sm font-medium mb-1">Horas Semanales Deseadas</label>
                                    <input
                                        type="number"
                                        id="weeklyAvailabilityHours"
                                        name="weeklyAvailabilityHours"
                                        value={profileData.weeklyAvailabilityHours || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                                        placeholder="Ej: 5"
                                    />
                                </div>
                            </div>
                        ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                                <p><strong>Nivel:</strong> {profileData.experienceLevel}</p>
                                <p><strong>Comunicación:</strong> {profileData.communicationStyle}</p>
                                <p><strong>Huso Horario:</strong> {profileData.timezonePreference}</p>
                                <p><strong>Horas/Semana:</strong> {profileData.weeklyAvailabilityHours}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">{isMentor ? 'Áreas de Especialización' : 'Mis Objetivos'}</h2>
                        <div className="flex flex-wrap">
                            {(profileData.expertise || []).map(tag => (
                                <span key={tag} className="relative group bg-secondary text-secondary-foreground text-base font-semibold mr-2 mb-2 px-4 py-2 rounded-full">
                                    {tag}
                                    {isEditing && (
                                        <button onClick={() => removeTag('expertise', tag)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            <XIcon className="h-3 w-3" />
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                         {isEditing && (
                            <div className="flex items-center mt-4 gap-2">
                                <input
                                    type="text"
                                    value={newExpertise}
                                    onChange={(e) => setNewExpertise(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTag('expertise')}
                                    placeholder={isMentor ? "Añadir nueva especialidad..." : "Añadir nuevo objetivo..."}
                                    className="flex-grow p-2 border border-border rounded-md bg-input text-foreground"
                                />
                                <Button onClick={() => addTag('expertise')} size="sm">Añadir</Button>
                            </div>
                        )}
                    </div>
                    
                     <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">Motivaciones e Intereses</h2>
                        <div className="flex flex-wrap">
                            {(profileData.motivations || []).map(tag => (
                                <span key={tag} className="relative group bg-secondary text-secondary-foreground text-base font-semibold mr-2 mb-2 px-4 py-2 rounded-full">
                                    {tag}
                                    {isEditing && (
                                        <button onClick={() => removeTag('motivations', tag)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            <XIcon className="h-3 w-3" />
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                         {isEditing && (
                            <div className="flex items-center mt-4 gap-2">
                                <input
                                    type="text"
                                    value={newMotivation}
                                    onChange={(e) => setNewMotivation(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTag('motivations')}
                                    placeholder="Añadir nueva motivación..."
                                    className="flex-grow p-2 border border-border rounded-md bg-input text-foreground"
                                />
                                <Button onClick={() => addTag('motivations')} size="sm">Añadir</Button>
                            </div>
                        )}
                    </div>


                     <div className="bg-card p-6 rounded-lg border border-border">
                        <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">Mi Disponibilidad</h2>
                        <p className="text-muted-foreground mb-4">
                            {isMentor 
                                ? 'Indica a las mentoreadas cuándo estás disponible para conectar.' 
                                : 'Indica a las mentoras cuándo estás disponible para conectar.'}
                        </p>
                        <div className="space-y-3">
                             {Object.entries(profileData.availability || {}).map(([date, times]) => (
                                <div key={date} className="bg-secondary p-3 rounded-md flex items-center justify-between">
                                    <p className="font-semibold">{new Date(date).toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {(times as string[]).map(time => <Tag key={time}>{time}</Tag>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {isEditing && (
                             <Button variant="secondary" className="mt-4" onClick={() => setIsCalendarOpen(true)}>Gestionar Disponibilidad</Button>
                        )}
                    </div>
                </div>
            </div>
            <AvailabilityCalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                currentAvailability={profileData.availability || {}}
                onSave={handleAvailabilitySave}
            />
        </div>
    );
};

export default ProfilePage;