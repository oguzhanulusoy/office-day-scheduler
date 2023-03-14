INSERT INTO role (role_name) VALUES ('SUPER_USER') ON CONFLICT (role_name) DO NOTHING;
INSERT INTO role (role_name) VALUES ('MANAGER') ON CONFLICT (role_name) DO NOTHING;
INSERT INTO role (role_name) VALUES ('EMPLOYEE') ON CONFLICT (role_name) DO NOTHING;

INSERT INTO zone (zone_name, code, lower_bound, upper_bound, price, transport_choice) SELECT 'Zone 1', 'Z1', 0, 10, 0, 'CAR' WHERE NOT EXISTS (SELECT 1 FROM zone LIMIT 1);

INSERT INTO department (department_code, department_manager_id, group_code, group_manager_id) SELECT 'DEP1', 1, 'GRP1', 1 WHERE NOT EXISTS (SELECT 1 FROM department LIMIT 1);

INSERT INTO "user" (email, first_name, last_name, password, registration_number, status, transport_choice, department_id, role_id, zone_id) SELECT 'super@super.com', 'Super', 'User', '$2a$10$1zIknhhIuwS.49Qgs55yD.ajIeYJcTwTx78Vy3u3vCOSf0gSZFdue', '123456789', 'ACTIVE', 'CAR', 1, 1, 1 WHERE NOT EXISTS (SELECT 1 FROM "user" WHERE role_id=1 LIMIT 1);