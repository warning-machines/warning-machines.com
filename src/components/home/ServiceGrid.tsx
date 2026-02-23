/* eslint-disable @next/next/no-img-element */
const services = [
  {
    id: 'pcb',
    title: 'PCB',
    image: 'PCB1.jpg'
  },
  {
    id: 'CAD',
    title: 'Industrial Design',
    image: 'CAD.jpg'
  },
  {
    id: 'firmware',
    title: 'Firmware',
    image: 'code.png'
  }
  // {
  //   id: 'machinery',
  //   title: 'Industrial Equipment and Machinery',
  //   image: 'machinery.png'
  // },
  // {
  //   id: 'hardware',
  //   title: 'Automotive and Mobility',
  //   image: 'automotive.jpg'
  // },
  // {
  //   id: 'electronics',
  //   title: 'Electronics and Smart Device',
  //   image: 'smart-device.jpg'
  // },
];

export function ServiceGrid() {
  return (
    <section className="section section--primary" id="services">
      <div className="section__header">
        <h1>Hardware Development Services</h1>
        
      </div>
      <div className="grid grid--services">
        {services.map((service) => (
          <article key={service.id} className="card card--service">
            <h3>{service.title}</h3>
            {service.image && <img src={`/images/services/${service.image}`} alt={service.title} />}
          </article>
        ))}
      </div>

      <p className="section__lede" style={{padding: '0 100px', fontSize: 'calc(0.5vw + 15px)'}}>
          With deep expertise in rapid prototyping, custom electronics development, precision CNC machining and Firmware/Software development services, we provide the essential tools to transform ideas into physical products, serving a diverse array of industries.
        </p>
    </section>
  );
}

