import '../projects.css';

function SmartGlasses() {
    return <div className="project">
        <h2>Smart glasses for blind people</h2>
        <div className="project-content">
            <div className="column">
                <p>
                    Smart glasses for blind people that use image recognition to help them navigate.
                </p>
            </div>
            <div className="column">
                <img src="/images/services/cad/glasses.png" alt="Glasses" />
            </div>
        </div>
    </div>
}

function Grenade() {
    return <div className="project">
        <h2>Airsoft grenade</h2>
        <div className="project-content">
            <div className="column">
                <p>
                    Airsoft grenade with display, timer and motion sensor.
                    It is controlled by an ESP32 board, has a buzzer and a motion sensor.
                </p>
            </div>
            <div className="column">
                <img src="/images/services/cad/grenade.jpg" alt="Grenade" />
            </div>
        </div>
    </div>
}


function Backtrack() {
    return <div className="project">
        <h2>"Backtrack" - posture tracking and improvement device</h2>
        <div className="project-content">
            <div className="column">
                <img src="/images/services/cad/backtrack.png" alt="Backtrack" />

            </div>
            <div className="column">
                <p>
                    "Backtrack" is a device that detects spine movements and position. The data is analyzed by AI and
                    the device reminds patients to fix their posture.
                    It is controlled by a Nordic board and uses a BLE (Bluetooth Low Energy) connection to communicate with a Python desktop app.
                </p>
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
            </div>
        </div>
    </div>
}

function Stand() {
    return <div className="project">
        <h2>Paper reading stand fro blind people</h2>
        <div className="project-content">
            <div className="column">
                <p>
                    Paper reading stand for blind people that uses a camera to read documents.
                </p>
            </div>
            <div className="column">
                <img src="/images/services/cad/stand_photo.jpg" alt="Paper reading stand for blind people" />
            </div>
        </div>
    </div>
}

export function OurProjects() {
    return <div className="our-projects">
        <h1 style={{fontFamily: 'Ethnocentric', color: '#ffc107', textAlign: 'center', marginTop: '40px'}}>Showcase</h1>
        <SmartGlasses />
        <Backtrack />
        <Grenade />
        <HealthWatch />
        <Stand />
    </div>
}