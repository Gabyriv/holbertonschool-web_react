/// <reference path="./Teacher.ts" />

namespace Subjects {
    export interface Teacher {
        experienceTeachingC?: number;
    };

    class Cpp extends Subject {

        teacher: Subjects.Teacher;

        getRequirements(): string {
            return "Here is the list of requirements for Cpp";
        };

        getAvailableTeacher(): string {
            if (!this.teacher.experienceTeachingC) {
                return "No available teacher";
            };

            return `Available Teacher: ${this.teacher.firstName}`
        };
    };
}
