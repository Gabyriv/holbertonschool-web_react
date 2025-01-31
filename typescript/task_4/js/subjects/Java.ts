/// <reference path="./Teacher.ts" />

namespace Subjects {
    export interface Teacher {
        experienceTeachingJava?: number;
    };

    class Java extends Subject {
        teacher: Subjects.Teacher;

        getRequirements(): string {
            return "Here is the list of requirements for Java";
        };

        getAvailableTeacher(): string {
            if (!this.teacher.experienceTeachingJava) {
                return "No available teacher";
            };

            return `Available Teacher ${this.teacher.firstName}`;
        };
    };
}
