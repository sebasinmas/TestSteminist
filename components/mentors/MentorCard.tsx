import React from 'react';
import type { Mentor } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import Tag from '../common/Tag';

interface MentorCardProps {
    mentor: Mentor;
    onViewProfile: (mentor: Mentor) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onViewProfile }) => {
    return (
        <Card className="flex flex-col h-full">
            <div className="flex items-center mb-4">
                <img src={mentor.avatarUrl} alt={mentor.name} className="w-20 h-20 rounded-full mr-4" />
                <div>
                    <h3 className="text-xl font-bold">{mentor.name}</h3>
                    <p className="text-md text-primary">{mentor.title}</p>
                    <p className="text-sm text-muted-foreground">{mentor.company}</p>
                </div>
            </div>
            <p className="text-sm text-foreground/80 mb-4 flex-grow">{mentor.bio}</p>
            <div className="mb-4">
                {mentor.expertise.slice(0, 3).map(tag => <Tag key={tag}>{tag}</Tag>)}
                 {mentor.expertise.length > 3 && <Tag>+{mentor.expertise.length - 3} más</Tag>}
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                <div className="text-sm">
                    <span className="font-bold text-yellow-500">★ {mentor.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground"> ({mentor.reviews} reseñas)</span>
                </div>
                <Button onClick={() => onViewProfile(mentor)} size="sm">Ver Perfil</Button>
            </div>
        </Card>
    );
};

export default MentorCard;