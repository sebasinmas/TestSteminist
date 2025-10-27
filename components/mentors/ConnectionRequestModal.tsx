
import React, { useState } from 'react';
import type { Mentor } from '../../types';
import Button from '../common/Button';
import { MENTORSHIP_GOALS } from '../../constants';
import { XIcon } from '../common/Icons';

interface ConnectionRequestModalProps {
    mentor: Mentor;
    isOpen: boolean;
    onClose: () => void;
    onSendRequest: (motivationLetter: string) => void;
}

const ConnectionRequestModal: React.FC<ConnectionRequestModalProps> = ({ mentor, isOpen, onSendRequest, onClose }) => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [additionalMessage, setAdditionalMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleTopicToggle = (topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
        );
    };

    const handleGoalToggle = (goal: string) => {
        setSelectedGoals(prev =>
            prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
        );
    };

    const handleClose = () => {
        // Reset state on close
        setSelectedTopics([]);
        setSelectedGoals([]);
        setAdditionalMessage('');
        setIsSubmitted(false); // also reset submitted state
        onClose();
    };

    const handleSubmit = () => {
        const motivationLetter = `**Temas de Interés:**\n- ${selectedTopics.join('\n- ')}\n\n**Objetivos:**\n- ${selectedGoals.join('\n- ')}\n\n**Mensaje Adicional:**\n${additionalMessage || 'N/A'}`;
        
        onSendRequest(motivationLetter);
        setIsSubmitted(true);
        
        setTimeout(() => {
           handleClose();
        }, 2500);
    };
    
    const isSubmitDisabled = selectedTopics.length === 0 || selectedGoals.length === 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-card rounded-lg p-6 m-4 max-w-xl w-full relative transform transition-all flex flex-col max-h-[90vh]">
                {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 transition-opacity duration-300">
                        <div className="w-24 h-24 relative mb-4">
                            <svg className="w-full h-full" viewBox="0 0 52 52">
                                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                            <style>{`
                                .checkmark__circle {
                                    stroke-dasharray: 166;
                                    stroke-dashoffset: 166;
                                    stroke-width: 3;
                                    stroke-miterlimit: 10;
                                    stroke: #22c55e;
                                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                                }
                                .checkmark__check {
                                    transform-origin: 50% 50%;
                                    stroke-dasharray: 48;
                                    stroke-dashoffset: 48;
                                    stroke-width: 4;
                                    stroke: #22c55e;
                                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                                }
                                @keyframes stroke {
                                    100% { stroke-dashoffset: 0; }
                                }
                            `}</style>
                        </div>
                        <h2 className="text-2xl font-bold">¡Solicitud Enviada!</h2>
                        <p className="text-muted-foreground mt-2">Tu solicitud ha sido enviada a {mentor.name}. Recibirás una notificación cuando la revise.</p>
                    </div>
                ) : (
                    <>
                        <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <XIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold mb-2">Enviar Solicitud de Conexión</h2>
                        <p className="text-muted-foreground mb-6">a {mentor.name}</p>

                        <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                            {/* Topics Section */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">1. Temas de Interés</h3>
                                <p className="text-sm text-muted-foreground mb-3">Selecciona los temas que más te interesan de la experiencia de {mentor.name}.</p>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.expertise.map(topic => (
                                        <button 
                                            key={topic} 
                                            onClick={() => handleTopicToggle(topic)}
                                            className={`text-sm font-semibold px-3 py-1.5 rounded-full border-2 transition-colors ${selectedTopics.includes(topic) ? 'bg-primary border-primary text-primary-foreground' : 'bg-transparent border-border hover:bg-accent'}`}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Goals Section */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">2. Tus Objetivos</h3>
                                <p className="text-sm text-muted-foreground mb-3">Elige tus principales objetivos para esta mentoría.</p>
                                <div className="space-y-2">
                                    {MENTORSHIP_GOALS.map(goal => (
                                        <label key={goal} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                            <input 
                                                type="checkbox"
                                                checked={selectedGoals.includes(goal)}
                                                onChange={() => handleGoalToggle(goal)}
                                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-foreground">{goal}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Message Section */}
                            <div>
                                <label htmlFor="motivation" className="block text-lg font-semibold mb-2">
                                3. Mensaje Adicional (Opcional)
                                </label>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Añade cualquier otro contexto que quieras que {mentor.name} conozca.
                                </p>
                                <textarea
                                    id="motivation"
                                    rows={4}
                                    value={additionalMessage}
                                    onChange={(e) => setAdditionalMessage(e.target.value)}
                                    className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                                    placeholder="Ej: Estoy trabajando en un proyecto específico sobre..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 pt-6 border-t border-border">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled}
                            >
                                Enviar Solicitud
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConnectionRequestModal;