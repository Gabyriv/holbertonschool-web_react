interface MajorCredits {
    credits: number;
    readonly _brand: "Major";
};

interface MinorCredits {
    credits: number;
    readonly _brand: "Minor";
};

function sumMajorCredits(subject1: MajorCredits, subject2: MajorCredits): MajorCredits {
    return {
        credits: subject1.credits + subject2.credits,
        _brand: "Major"
    };
};

function sumMinorCredits(subject1: MinorCredits, subject2: MinorCredits): MinorCredits {
    return {
        credits: subject1.credits + subject2.credits,
        _brand: "Minor"
    };
};
