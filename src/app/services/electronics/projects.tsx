import '../projects.css';

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
                    <li>WiFi connection</li>
                </ul>
            </div>
        </div>
    </div>
}

export function OurProjects() {
    return <div className="our-projects">
        <HealthWatch />
    </div>
}
