use tracker_db;

INSERT INTO department (department_name)
VALUES
('Finance'),
('Sports'),
('Tech'),
('ArmedForces'),
('Government'),
('Health');

INSERT INTO role (title, salary, department_id)
VALUES
('Prime Minister', 10000, 5),
('Auditor', 5000, 1),
('ParaLegal', 7000, 1), 
('Major', 6000, 4),
('Quarterback', 10000, 2),
('Data Analyst', 4000, 3),
('Mayor', 9000, 5),
('Nurse', 8000, 6),
('Sorter', 250, 1),
('Waterboy', 250, 2),
('Hacker', 3000, 3),
('General', 8000, 4),
('Doctor', 10000, 6),
('Congressman', 10000, 5),
('Whitehat', 5000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Burger', 'King', 1, NULL),
('Pizza', 'Hut', 1, 1),
('Dairy', 'Queen', 2, NULL),
('Second', 'Cup', 3, 1),
('Mac', 'Donalds', 3, 1),
('Kentucky', 'FChicken', 4, NULL),
('Boston', 'Pizza', 5, 6),
('Popeyes', 'Kitchen', 6, NULL),
('Jolli', 'Bee', 7, 8),
('Star', 'Bucks', 8, 8),
('Tim', 'Hortons', 9, NULL),
('Dunkin', 'Donut', 10, 3),
('Pizza', 'Pizza', 11, NULL),
('Thai', 'Express', 12, 3),
('Wild', 'Wing', 13, NULL);