import { OurProjects } from "./projects";

export default function CNCMachiningPage() {
    return <main className="section blog service-page">
    <div className="section__header">
      <div className="section__header-content">
        <h1>CNC Machining</h1>
        <p className="section__lede">
          We do CNC machining for metal and wooden parts.
        </p>
      </div>
      <img className="article__hero" src='/images/services/cnc/router.jpg' alt='CNC Machining' style={{objectPosition: '50% 40%'}} />
      <div className="gradient"></div>
    </div>
    <article className="article__body">
      {/* <OurProjects /> */}
    </article>
  </main>
}