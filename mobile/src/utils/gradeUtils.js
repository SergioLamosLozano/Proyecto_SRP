/**
 * Filters and groups subjects by low grades (<= 2.9), 
 * keeping only the worst grade per subject.
 * @param {Array} subjects - The list of subjects from subjectsData
 * @returns {Array} - List of consolidated warning objects sorted by grade ASC
 */
export const getConsolidatedLowGrades = (subjects) => {
    const alertsMap = new Map();

    subjects.forEach(subject => {
        let worstGrade = null;
        let worstActivity = "";

        subject.grades.forEach(g => {
            if (g.grade <= 2.9) {
                if (worstGrade === null || g.grade < worstGrade) {
                    worstGrade = g.grade;
                    worstActivity = g.activity;
                }
            }
        });

        if (worstGrade !== null) {
            alertsMap.set(subject.id, {
                subjectId: subject.id,
                subjectName: subject.name,
                subjectIcon: subject.icon,
                grade: worstGrade,
                activity: worstActivity,
                subject: subject // The whole object for navigation
            });
        }
    });

    // Convert map to array and sort by grade ASC (worst first)
    return Array.from(alertsMap.values()).sort((a, b) => a.grade - b.grade);
};
