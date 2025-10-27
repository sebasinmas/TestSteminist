import React from 'react';
import type { Mentor } from '../../types';
import Card from '../common/Card';
import Tag from '../common/Tag';

interface MentorProfileDetailsProps {
    mentor: Mentor;
}

const MentorProfileDetails: React.FC<MentorProfileDetailsProps> = ({ mentor }) => {
    return (
        <div className="space-y-6">
            <Card className="text-center p-6">
                <img src={mentor.avatarUrl} alt={mentor.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/20" />
                <h2 className="text-xl font-bold">{mentor.name}</h2>
                <p className="text-md text-muted-foreground mb-1">{mentor.title}</p>
                <p className="text-sm text-muted-foreground mb-4">{mentor.company}</p>
                <div className="text-lg mb-4">
                    <span className="font-bold text-yellow-500">★ {mentor.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground"> ({mentor.reviews} reseñas)</span>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Sobre Mí</h3>
                <p className="text-foreground/90 whitespace-pre-line text-sm">{mentor.longBio}</p>
            </Card>
            
            <Card>
                <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Especialización</h3>
                <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map(tag => <Tag key={tag} className="text-xs px-2 py-1">{tag}</Tag>)}
                </div>
            </Card>
            
            <Card>
                 <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Disponibilidad</h3>
                 <div className="flex flex-wrap gap-2">
                    {Object.keys(mentor.availability).slice(0, 5).map(date => (
                        <div key={date} className="bg-secondary text-secondary-foreground rounded-md p-2 text-center text-xs flex-grow">
                            <p className="font-bold">{new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</p>
                            <p>{new Date(date).toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                        </div>
                    ))}
                     {Object.keys(mentor.availability).length > 5 && <div className="text-xs text-muted-foreground p-2 flex items-center justify-center">...y más</div>}
                </div>
            </Card>
        </div>
    );
};
export default MentorProfileDetails;