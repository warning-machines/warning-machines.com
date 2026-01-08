import '../projects.css';

function Sentry() {
    return <div className="project">
        <h2>"Sentry" - position tracking robot</h2>
        <div className="project-content">
            <div className="column">
                <p>
                    Sentry is a position tracking robot that uses image recognition to track the position of a human.
                    It uses a horizontal and vertical stepper motor to orient the robot towards human. It is controlled by a Linux-based system with a Nordic board.
                    Our in-house firmware supports features like image recognition, human detection and position tracking, horizontal + vertical stepper motor control, and WIFI connection.
                </p>
                <ul>
                    <li>Nordic board</li>
                    <li>Linux</li>
                    <li>C</li>
                    <li>USB camera</li>
                    <li>Image recognition</li>
                    <li>Human detection and position tracking</li>
                    <li>Horizontal + vertical stepper motor control</li>
                    <li>WIFI connenction</li>
                </ul>
            </div>
            <div className="column">
                <img src="/images/services/firmware/sentry.jpg" alt="Sentry" />
            </div>
        </div>
    </div>
}

function Grenade() {
    return <div className="project">
        <h2>Airsoft grenade</h2>
        <div className="project-content">
            <div className="column">
                <img src="/images/services/firmware/grenade.jpg" alt="Grenade" />
            </div>
            <div className="column">
                <p>
                    Airsoft grenade with display, timer and motion sensor.
                    It is controlled by an ESP32 board, has a buzzer and a motion sensor.
                </p>
                <ul>
                    <li>ESP32 chip</li>
                    <li>OLED display</li>
                    <li>Motion sensor</li>
                    <li>C</li>
                </ul>
            </div>
        </div>
    </div>
}


function Backtrack() {
    return <div className="project">
        <h2>"Backtrack" - posture tracking and improvement device</h2>
        <div className="project-content">
            <div className="column">
                <img src="/images/services/firmware/grubnaka1.webp" alt="Backtrack" />

            </div>
            <div className="column">
                <p>
                    "Backtrack" is a device that detects spine movements and position. The data is analyzed by AI and
                    the device reminds patients to fix their posture.
                    It is controlled by a Nordic board and uses a BLE (Bluetooth Low Energy) connection to communicate with a Python desktop app.
                </p>
                <ul>
                    <li>Zephyr RTOS</li>
                    <li>Nordic nrf52840 board</li>
                    <li>lsm6dso accelerometer and gyroscope</li>
                    <li>C</li>
                    <li>BLE (Bluetooth Low Energy) connection</li>
                    <li>WIFI connenction</li>
                    <li>AI-based posture detection</li>
                    <li>Python desktop app with BLE connection</li>
                </ul>
            </div>
        </div>
    </div>
}

function HealthWatch() {
    return <div className="project">
        <h2>Health tracking watch</h2>
        <div className="project-content">
            <div className="column">
                <img src="/images/services/firmware/grubnaka2.webp" alt="Health tracking watch" />
            </div>
            <div className="column">
                <p>
                    Health tracking watch with heart rate monitoring, sleep tracking, and activity tracking.
                    It is controlled by a Nordic board and uses a BLE (Bluetooth Low Energy) connection to communicate with a Python desktop app.
                </p>
                <ul>
                    <li>First prototype with stm32wb55 chip</li>
                    <li>Second version with Nordic nrf52840 board</li>
                    <li>lsm6dso accelerometer and gyroscope</li>
                    <li>C</li>
                    <li>stm32cube</li>
                    <li>Zephyr RTOS</li>
                    <li>BLE (Bluetooth Low Energy) connection</li>
                    <li>WIFI connenction</li>
                    <li>Heart rate monitoring</li>
                    <li>Temperture tracking</li>
                    <li>SPO2 sensor</li>
                    <li>Python desktop app with BLE connection</li>
                </ul>
            </div>
        </div>
    </div>
}

export function OurProjects() {
    return <div className="our-projects">
        <h1 style={{fontFamily: 'Ethnocentric', color: '#ffc107', textAlign: 'center', marginTop: '40px'}}>Showcase</h1>
        <Sentry />
        <Backtrack />
        <Grenade />
        <HealthWatch />
    </div>
}