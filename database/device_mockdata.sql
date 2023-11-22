-- Mockdata para Scopes
INSERT INTO SCOPE (SCOPE_NAME) 
VALUES 
    ('ENCENDER_LED'),
    ('APAGAR_LED');

-- Mockdata para Leds
INSERT INTO LEDS (LED_NAME, ESP_PIN) 
VALUES
    ('Sala', 17),
    ('Cocina', 18),
    ('Dormitorio', 19);

-- Mockdata para Devices
INSERT INTO DEVICE (DEVICE_NAME, IPV4, GRANTED_CONN, USERS_USER_ID)
VALUES
    ('Iphone de Juan', '192.168.10.1', 1, 3);