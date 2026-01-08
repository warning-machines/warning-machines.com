import '../projects.css';

function Sentry() {
    return <div className="project">
        <h2>"Sentry" - position tracking robot</h2>
        <div className="project-content">
            <div className="column">
                <p>
                    Sentry is a position tracking robot that uses image recognition to track the position of a human.
                    It uses a horizontal and vertical stepper motor to orient the robot towards human. It is controlled by a Nordic board.
                </p>
                <ul>
                    <li>Nordic board</li>
                    <li>USB camera</li>
                    <li>Image recognition</li>
                    <li>Horizontal + vertical stepper motor control</li>
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
                    It is controlled by an ESP32 board, has a motion sensor, display, charging and battery charge sensing circuit an ignition circuit. 
                </p>
                <ul>
                    <li>ESP32 chip</li>
                    <li>OLED display</li>
                    <li>Motion sensor</li>
                    <li>Charging and battery charge sensing circuit</li>
                    <li>Ignition circuit</li>
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
                    "Backtrack" is a device that detects spine movements and position. It is controlled by a Nordic-based custom PCB.
                    The PCB includes charging circuit, accelerometer and gyroscope.
                </p>
                <ul>
                    <li>Nordic-based custom PCB</li>
                    <li>lsm6dso accelerometer and gyroscope</li>
                    <li>Charging circuit</li>
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
                    It is controlled by a Nordic-based custom PCB. The PCB includes accelerometer and gyroscope, heart rate sensor, temperature sensor, SPO2 sensor.
                </p>
                <ul>
                    <li>Nordic-based custom PCB</li>
                    <li>lsm6dso accelerometer and gyroscope</li>
                    <li>Heart rate sensor</li>
                    <li>Temperature sensor</li>
                    <li>SPO2 sensor</li>
                    <li>BLE (Bluetooth Low Energy) connection</li>
                    <li>WIFI connenction</li>
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