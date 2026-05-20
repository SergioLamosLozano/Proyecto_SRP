export const subjects = [
    {
        id: 1,
        name: "Matemáticas",
        average: 3.2,
        icon: "calculator",
        grades: [
            { id: 101, activity: "Evaluación sobre divisiones", grade: 3.5 },
            { id: 102, activity: "Ecuaciones diferenciales", grade: 2.0 },
            { id: 103, activity: "Taller integrales", grade: 4.2 }
        ]
    },
    {
        id: 2,
        name: "Español",
        average: 4.2,
        icon: "book-open-variant",
        grades: [
            { id: 201, activity: "Ensayo literario", grade: 4.5 },
            { id: 202, activity: "Análisis gramatical", grade: 3.9 },
            { id: 203, activity: "Análisis de texto", grade: 1.0 }
        ]
    },
    {
        id: 3,
        name: "Ciencias Naturales",
        average: 4.8,
        icon: "flask",
        grades: [
            { id: 301, activity: "Laboratorio de química", grade: 4.9 },
            { id: 302, activity: "Proyecto biodiversidad", grade: 4.7 }
        ]
    },
    {
        id: 4,
        name: "Inglés",
        average: 4.0,
        icon: "translate",
        grades: [
            { id: 401, activity: "Examen oral", grade: 4.2 },
            { id: 402, activity: "Taller gramática", grade: 3.8 }
        ]
    },
    {
        id: 5,
        name: "Sociales",
        average: 4.6,
        icon: "earth",
        grades: [
            { id: 501, activity: "Mapa histórico", grade: 4.7 },
            { id: 502, activity: "Debate político", grade: 4.5 }
        ]
    },
    {
        id: 6,
        name: "Educación Física",
        average: 4.3,
        icon: "run",
        grades: [
            { id: 601, activity: "Prueba atletismo", grade: 4.5 },
            { id: 602, activity: "Circuito de ejercicios", grade: 4.1 }
        ]
    },
    {
        id: 7,
        name: "Estadística",
        average: 3.8,
        icon: "chart-bar",
        grades: [
            { id: 701, activity: "Tablas de frecuencia", grade: 3.5 },
            { id: 702, activity: "Gráficos de barras", grade: 4.1 }
        ]
    },
    {
        id: 8,
        name: "Religión",
        average: 4.5,
        icon: "hands-pray",
        grades: [
            { id: 801, activity: "Taller valores", grade: 4.8 },
            { id: 802, activity: "Ensayo ética", grade: 4.2 }
        ]
    }
];

export const allActivities = subjects.flatMap(subject =>
    subject.grades.map(grade => ({
        ...grade,
        subjectName: subject.name,
        subjectIcon: subject.icon
    }))
);

export const scheduleData = [
    { id: 1, day: "Lunes", subject: "Matemáticas", time: "07:00 - 09:00", room: "Salón 201" },
    { id: 2, day: "Lunes", subject: "Inglés", time: "09:30 - 11:30", room: "Lab Idiomas" },
    { id: 3, day: "Martes", subject: "Español", time: "07:00 - 09:00", room: "Salón 102" },
    { id: 4, day: "Martes", subject: "Sociales", time: "10:00 - 12:00", room: "Salón 304" },
    { id: 5, day: "Miércoles", subject: "Ciencias", time: "07:00 - 10:00", room: "Laboratorio" },
];

export const messagesData = [
    { id: 1, title: "Reunión de Padres", sender: "Rectoría", date: "25 Feb", content: "Cordial saludo, citamos a reunión este viernes a las 4:00 PM.", icon: "account-group" },
    { id: 2, title: "Salida Pedagógica", sender: "Doc. Sociales", date: "22 Feb", content: "Recordar traer el permiso firmado para el museo.", icon: "bus-school" },
    { id: 3, title: "Nueva Tarea", sender: "Plataforma", date: "20 Feb", content: "Se ha asignado un nuevo taller de integrales.", icon: "bell-outline" },
];

export const semesterAverages = [
    { period: "Primer Periodo", average: "4.2" },
    { period: "Segundo Periodo", average: "4.5" },
    { period: "Tercer Periodo", average: "4.4" },
    { period: "Cuarto Periodo", average: "--" },
];

export const generalAverage = "4.42";
export const studentInfo = {
    name: "Juan Pérez",
    grade: "Grado 8°B"
};
