import type { Mentor, Mentee, Session, ConnectionRequest, Mentorship } from '../types';

export const mockMentors: Mentor[] = [
    {
        id: 1,
        name: 'Dra. Evelyn Reed',
        title: 'Científica Investigadora Principal',
        company: 'BioGen Innovations',
        bio: 'Pionera en tecnología CRISPR con más de 15 años en investigación y desarrollo de biotecnología.',
        longBio: 'La Dra. Evelyn Reed es una científica líder en BioGen Innovations, donde encabeza la investigación en tecnologías de edición genética. Con un doctorado en Biología Molecular de Stanford, ha publicado más de 50 artículos y posee varias patentes. A Evelyn le apasiona guiar a la próxima generación de científicas y ayudarlas a navegar las complejidades de una carrera en la investigación biotecnológica.',
        avatarUrl: 'https://picsum.photos/seed/evelyn/200',
        rating: 4.9,
        reviews: 82,
        expertise: ['Biotecnología', 'CRISPR', 'Genética', 'Investigación', 'Gestión de Laboratorio'],
        availability: {
            '2024-07-29': ['10:00', '11:00', '14:00'],
            '2024-07-30': ['09:00', '15:00'],
            '2024-08-01': ['10:00', '11:00', '13:00', '14:00'],
        },
        maxMentees: 3,
        // PAP Fields
        experienceLevel: 'Lead',
        communicationStyle: 'Analítico',
        timezonePreference: 'Local',
        weeklyAvailabilityHours: 5,
        motivations: ['Liderazgo', 'Publicación Académica', 'Innovación Disruptiva']
    },
    {
        id: 2,
        name: 'Aisha Khan',
        title: 'Gerente de Producto Senior, IA',
        company: 'Innovate AI Corp',
        bio: 'Liderando la estrategia de productos de IA para soluciones empresariales. Experta en productos basados en ML.',
        longBio: 'Aisha Khan tiene una década de experiencia construyendo y escalando productos de IA que resuelven problemas empresariales del mundo real. En Innovate AI Corp, gestiona todo el ciclo de vida del producto, desde la ideación hasta el lanzamiento. Posee un MBA del MIT Sloan y es defensora de la IA ética. A Aisha le gusta orientar a las mujeres sobre cómo ingresar a la gestión de productos y liderar equipos técnicos.',
        avatarUrl: 'https://picsum.photos/seed/aisha/200',
        rating: 4.8,
        reviews: 112,
        expertise: ['Gestión de Producto', 'IA/ML', 'Ciencia de Datos', 'Estrategia de Mercado'],
        availability: {
             '2024-07-29': ['13:00', '14:00', '16:00'],
            '2024-07-31': ['11:00', '12:00'],
        },
        maxMentees: 4,
        // PAP Fields
        experienceLevel: 'Senior',
        communicationStyle: 'Directo',
        timezonePreference: 'Similar (±3h)',
        weeklyAvailabilityHours: 8,
        motivations: ['Crecimiento Profesional', 'Liderazgo', 'Balance vida-trabajo']
    },
    {
        id: 3,
        name: 'Dra. Maria Garcia',
        title: 'Líder de Ingeniería de Hardware',
        company: 'QuantumLeap Computing',
        bio: 'Construyendo la próxima generación de computadoras cuánticas. Del silicio a los sistemas.',
        longBio: 'La Dra. Maria Garcia está a la vanguardia de la revolución de la computación cuántica. Como Líder de Ingeniería de Hardware en QuantumLeap, diseña y construye unidades de procesamiento cuántico (QPUs). Su trabajo involucra ciencia de materiales, criogenia e integración de sistemas complejos. Maria se dedica a desmitificar la ingeniería de hardware y a animar a más mujeres a entrar en este campo apasionante.',
        avatarUrl: 'https://picsum.photos/seed/maria/200',
        rating: 5.0,
        reviews: 45,
        expertise: ['Ingeniería de Hardware', 'Computación Cuántica', 'Semiconductores', 'Arquitectura de Sistemas'],
        availability: {
            '2024-07-30': ['10:00', '11:00'],
            '2024-08-02': ['13:00', '14:00', '15:00'],
        },
        maxMentees: 2,
        // PAP Fields
        experienceLevel: 'Lead',
        communicationStyle: 'Formal',
        timezonePreference: 'Global',
        weeklyAvailabilityHours: 3,
        motivations: ['Innovación Disruptiva', 'Investigación Aplicada']
    },
    {
        id: 4,
        name: 'Chloe Chen',
        title: 'Fundadora & CEO',
        company: 'ConnectSphere',
        bio: 'Emprendedora en serie que llevó una idea de un garaje a una salida exitosa. Apasionada por las startups.',
        longBio: 'Chloe Chen es una emprendedora experimentada con un historial de creación de empresas tecnológicas exitosas. Fundó ConnectSphere, una plataforma de redes sociales que fue adquirida por un gigante tecnológico. Ahora invierte y asesora a startups en etapa inicial, con un enfoque en empresas fundadas por mujeres. Chloe ofrece consejos prácticos sobre recaudación de fondos, formación de equipos y cómo navegar el ecosistema de startups.',
        avatarUrl: 'https://picsum.photos/seed/chloe/200',
        rating: 4.9,
        reviews: 150,
        expertise: ['Emprendimiento', 'Startups', 'Capital de Riesgo', 'Ajuste Producto-Mercado'],
        availability: {
            '2024-08-01': ['09:00', '10:00'],
            '2024-08-02': ['11:00', '14:00'],
        },
        maxMentees: 5,
        // PAP Fields
        experienceLevel: 'C-Level',
        communicationStyle: 'Casual',
        timezonePreference: 'Similar (±3h)',
        weeklyAvailabilityHours: 10,
        motivations: ['Emprendimiento', 'Liderazgo', 'Networking']
    }
];

export const mockMentee: Mentee = {
    id: 101,
    name: 'Priya Sharma',
    avatarUrl: 'https://picsum.photos/seed/priya/200',
    pronouns: 'Ella',
    neurodivergence: 'TDAH',
};

export const mockMentee2: Mentee = {
    id: 102,
    name: 'Jasmine Lee',
    avatarUrl: 'https://picsum.photos/seed/jasmine/200',
    pronouns: 'Elle',
}

export const mockCurrentUserMentee: Required<Mentee> = {
    id: 101,
    name: 'Priya Sharma',
    avatarUrl: 'https://picsum.photos/seed/priya/200',
    title: 'Aspirante a Científica de Datos',
    company: 'Universidad de Washington',
    bio: 'Actualmente cursando mi Máster en Ciencia de Datos. Me apasiona aprovechar el aprendizaje automático para resolver problemas del mundo real en sostenibilidad y tecnología climática. Deseosa de conectar con mentoras que puedan guiar mi transición de la academia a la industria.',
    // Objetivos de la mentee (usado como 'expertise' para el match)
    expertise: ['Ciencia de Datos', 'IA/ML', 'Crecimiento Profesional'],
    availability: {
        '2024-08-05': ['13:00', '14:00', '16:00'],
        '2024-08-07': ['10:00', '11:00'],
        '2024-08-08': ['15:00'],
    },
    pronouns: 'Ella',
    neurodivergence: 'TDAH',
    // PAP Fields
    experienceLevel: 'Junior',
    communicationStyle: 'Directo',
    timezonePreference: 'Local',
    weeklyAvailabilityHours: 6,
    motivations: ['Balance vida-trabajo', 'Crecimiento Profesional', 'Networking']
};

export const mockCurrentMentor: Mentor = mockMentors[0];

export const mockMentorships: Mentorship[] = [
    {
        id: 1,
        mentor: mockMentors[0],
        mentee: mockCurrentUserMentee,
        status: 'active',
        startDate: '2024-07-15',
        sessions: [
            {
                id: 1,
                sessionNumber: 1,
                date: '2024-07-18',
                time: '10:00',
                duration: 60,
                status: 'completed',
                topic: 'Revisión de propuesta de doctorado',
                menteeGoals: 'Revisión final de mi propuesta de doctorado antes de la presentación.',
                rating: 5,
                feedback: 'La Dra. Reed proporcionó un feedback excepcional que fortaleció significativamente mi propuesta.',
                mentorSurvey: {
                    preparation: 'excellent',
                    engagement: 'excellent',
                    outcome: 'Priya llegó muy preparada. Revisamos su propuesta y pulimos los puntos clave. Gran progreso.'
                },
                attachments: [{ name: 'propuesta_v1.pdf', url: '#' }]
            },
            {
                id: 2,
                sessionNumber: 2,
                date: '2024-08-05',
                time: '11:00',
                duration: 45,
                status: 'confirmed',
                topic: 'Plan de carrera post-doctorado',
                menteeGoals: 'Explorar opciones de carrera en la industria vs. la academia.',
                attachments: [{ name: 'carrera_plan.docx', url: '#' }]
            },
        ]
    },
    {
        id: 2,
        mentor: mockMentors[1],
        mentee: mockCurrentUserMentee,
        status: 'active',
        startDate: '2024-07-20',
        sessions: [
            {
                id: 4,
                sessionNumber: 1,
                date: '2024-07-25',
                time: '14:00',
                duration: 45,
                status: 'completed',
                topic: 'Revisión del Roadmap de Producto de IA',
                menteeGoals: 'Obtener feedback sobre mi roadmap de producto del Q3 para nuestra nueva función de ML.',
                rating: 5,
                feedback: 'Aisha fue directa y muy útil. Su perspectiva de la industria es invaluable.'
            },
        ]
    },
     {
        id: 3,
        mentor: mockMentors[3],
        mentee: mockMentee2,
        status: 'termination_requested',
        terminationReason: "Los objetivos iniciales de la mentoría se cumplieron antes de lo esperado. Jasmine ha logrado grandes avances y ambos acordamos que el ciclo puede concluir.",
        startDate: '2024-06-01',
        sessions: [
            {
                id: 5,
                sessionNumber: 1,
                date: '2024-06-10',
                time: '10:00',
                duration: 60,
                status: 'completed',
                topic: 'Feedback sobre Pitch Deck de Startup',
                menteeGoals: 'Obtener una crítica real de mi pitch deck para inversores.',
                rating: 5,
                feedback: '¡Chloe fue increíble! Su feedback fue increíblemente perspicaz y práctico.'
            },
             {
                id: 6,
                sessionNumber: 2,
                date: '2024-06-24',
                time: '10:00',
                duration: 60,
                status: 'completed',
                topic: 'Estrategias de Go-to-Market',
                menteeGoals: 'Definir canales de adquisición de clientes para el lanzamiento beta.',
                rating: 5,
                feedback: 'Otra sesión fantástica.'
            },
        ]
    },
];

// Flat list of sessions that are not yet confirmed, for notifications page
export const mockPendingSessions: Session[] = [
    {
        id: 101,
        sessionNumber: 1,
        // @ts-ignore
        mentor: mockMentors[2],
        // @ts-ignore
        mentee: mockCurrentUserMentee,
        date: '2024-08-10',
        time: '15:00',
        duration: 30,
        status: 'needs_confirmation',
        topic: 'Transición de carrera a Hardware',
        menteeGoals: 'Entender las habilidades que necesito para pasar de la ingeniería de software a la de hardware.'
    },
    {
        id: 102,
        sessionNumber: 1,
        // @ts-ignore
        mentor: mockMentors[0],
        // @ts-ignore
        mentee: mockMentee2,
        date: '2024-08-12',
        time: '11:00',
        duration: 60,
        status: 'pending',
        topic: 'Discusión sobre diseño experimental de CRISPR',
        menteeGoals: 'Revisar mi diseño experimental propuesto para un nuevo estudio de edición genética.'
    }
]


export const mockConnectionRequests: ConnectionRequest[] = [
    {
        id: 1,
        mentor: mockMentors[3],
        mentee: mockCurrentUserMentee,
        status: 'pending',
        motivationLetter: "**Temas de Interés:**\n- Emprendimiento\n- Startups\n- Capital de Riesgo\n\n**Objetivos:**\n- Orientación profesional\n- Networking en la industria\n\n**Mensaje Adicional:**\nEstimada Chloe, admiro enormemente tu trabajo con ConnectSphere. Actualmente estoy en las primeras etapas de construir mi propia startup en el espacio EdTech y estaría increíblemente agradecida por tu orientación sobre el ajuste producto-mercado y las estrategias de recaudación de fondos en etapas iniciales. Tu experiencia sería invaluable.",
    }
];