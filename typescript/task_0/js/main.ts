interface Student {
    firstName: string;
    lastName: string;
    age: number;
    location: string;
};

const student1: Student = {
    firstName: "Gabriel",
    lastName: "Rivera",
    age: 18,
    location: "School",
};

const student2: Student = {
    firstName: "Gabriel",
    lastName: "Rivera",
    age: 18,
    location: "House",
};

const studentsList: Array<Student> = [student1, student2];

const table = document.createElement('table');
const tableBody = document.createElement('tbody');

const headerRow = document.createElement('tr');
const firstNameHeader = document.createElement('th');
const locationHeader = document.createElement('th');

headerRow.textContent = 'Student List';
firstNameHeader.textContent = 'First Name';
locationHeader.textContent = 'Location';

headerRow.appendChild(firstNameHeader);
headerRow.appendChild(locationHeader);
tableBody.appendChild(headerRow);

studentsList.forEach((student: Student) => {
    const row = document.createElement('tr');
    const firstNameCell = document.createElement('td');
    const locationCell = document.createElement('td');

    firstNameCell.textContent = student.firstName;
    locationCell.textContent = student.location;

    row.appendChild(firstNameCell);
    row.appendChild(locationCell);
    tableBody.appendChild(row);
});

table.appendChild(tableBody);
document.body.appendChild(table);
