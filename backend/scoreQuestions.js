// frontend/src/utils/scoreCalculator.js

export function calculateScore(answers) {
    const weights = {
        Environment: 35,
        Social: 35,
        Governance: 30,
    };

    const totalQuestions = {
        Environment: 50,
        Social: 55,
        Governance: 55,
    };

    let scores = {
        Environment: 0,
        Social: 0,
        Governance: 0,
        total: 0,
    };

    for (let category in answers) {
        const yesCount = answers[category].filter((a) => a === 1).length;
        const score =
            (yesCount / totalQuestions[category]) * weights[category];
        scores[category] = score;
    }

    scores.total =
        scores.Environment + scores.Social + scores.Governance;

    return scores;
}
