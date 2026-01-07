function Sentry() {
    return <div className="project">
        <h2>"Sentry" - position tracking robot</h2>
        <div className="project-content">
            <div className="left-column">
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
            <div className="right-column">
                <img src="/images/services/firmware/sentry.jpg" alt="Sentry" />
            </div>
        </div>
    </div>
}

function Grenade() {

}


function Backtrack() {
    return <div className="project">
        <h2>"Backtrack" - posture tracking and improvement device</h2>
        <div className="project-content">
            <div className="left-column">
                <p>
                    
                </p>
                <ul>
                    <li>Nordic nrf52840 board</li>
                    <li>lsm6dso accelerometer and gyroscope</li>
                    <li>C</li>
                    <li>WIFI connenction</li>
                </ul>
            </div>
            <div className="right-column">
                {/* <img src="/images/services/firmware/sentry.jpg" alt="Sentry" /> */}
            </div>
        </div>
    </div>
}

function HealthWatch() {

}

export function OurProjects() {
    return <div className="our-projects">
        <h1>Showcase</h1>
        <Sentry />
        {/* <Grenade /> */}
        <Backtrack />
        {/* <HealthWatch /> */}
    </div>
}