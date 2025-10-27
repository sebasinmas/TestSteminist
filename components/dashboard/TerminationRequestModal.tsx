import React, { useState } from 'react';
import type { Session, UserRole } from '../../types';
import Button from '../common/Button';
import { XIcon } from '../common/Icons';

interface TerminationRequestModalProps {
    session: Session;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (sessionId: number, reason: string) => void;
    userRole: UserRole;
}

const TerminationRequestModal: React.FC<TerminationRequestModalProps> = ({ session, isOpen, onClose, onSubmit, userRole }) => {
    const [reason, setReason] = useState('');
    
    if (!isOpen) return null;
    
    const otherPartyName = userRole === 'mentor' ? session.mentee.name : session.mentor.name;

    const handleSubmit = () => {
        if (!reason.trim()) return;
        onSubmit(session.id, reason);
        setReason(''); // Reset after sending
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="bg-card rounded-lg p-8 m-4 max-w-2xl w-full relative transform transition-all">
                <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-2">Solicitar Terminación de Mentoría</h2>
                <p className="text-muted-foreground mb-6">Respecto a tu mentoría con {otherPartyName}</p>

                <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-2">
                        Razón de la Terminación
                    </label>
                    <p className="text-sm text-muted-foreground mb-2">
                        Por favor, proporciona una breve razón para finalizar esta mentoría. Se enviará al administrador de la plataforma para su revisión.
                    </p>
                    <textarea
                        id="reason"
                        rows={6}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                        placeholder="Ej: Cambio de disponibilidad, los objetivos se han cumplido, desajuste de expectativas..."
                    />
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={!reason.trim()}
                    >
                        Enviar Solicitud de Terminación
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TerminationRequestModal;