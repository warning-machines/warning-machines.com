import { OurProjects } from "./projects";

export default function CADPage() {
    return <main className="section blog service-page">
    <div className="section__header">
      <div className="section__header-content">
        <h1>CAD</h1>
        <p className="section__lede">
          We do CAD/CAM for 3D printing, CNC machining, laser cutting, and more.
        </p>
      </div>
      <img className="article__hero" src='/images/services/CAD.jpg' alt='CAD' style={{objectPosition: '50% 40%'}} />
      <div className="gradient"></div>
    </div>
    <article className="article__body">
      <OurProjects />
    </article>
  </main>
}