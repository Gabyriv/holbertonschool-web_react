interface Teacher {
    readonly firstName: string; // readonly is used for setting the object only at initialization.
    readonly lastName: string;
    fullTimeEmployee: boolean;
    yearOfExperience?: number; // the ? is for optional objects.
    location: string;
    [key: string]: any; // This let's the user the possibility to add any attribute to an object with [key: string] is for the name of the attribute and "any" is the type of the attribute.
};

// Like in JS in TS you use extends for inheritance.
interface Directors extends Teacher {
    numberOfReports: number;
};

interface printTeacherFunction {
    (firstName: string, lastName: string): string;
};

function printTeacher(firstName: string, lastName: string) {
    console.log(`${firstName[0]}. ${lastName}`)
}

// The StudentsInterface and the StudentConstructor is to describe the StudentClass through an Interface.
interface StudentsInterface {
    firstName: string;
    lastName: string;
    workOnHomework(): string;
    displayName(): string;
};

interface StudentConstructor {
    new(firstName: string, lastName: string): StudentsInterface;
};

class StudentClass implements StudentsInterface {

    firstName: string;
    lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    };

    /**
     * Tells is it's currently working on the homework.
     */
    workOnHomework(): string {
        return `Currently Working`;
    };

    /**
     * Displays the name of the user.
     */
    displayName(): string {
        return this.firstName
    }
};
