/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

const services = [
  {
    id: 'pcb',
    title: 'PCB',
    image: '/images/home/pcb/PCB1.jpg',
    href: '/services/electronics',
  },
  {
    id: 'CAD',
    title: 'Industrial Design',
    image: '/images/home/industrial-design/DFM.jpg',
    href: '/services/cad/experimental',
  },
  {
    id: 'firmware',
    title: 'Firmware',
    image: '/images/home/firmware/code.png',
    href: '/services/firmware',
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    image: '/images/home/manufacturing/metal.jpg',
    href: '/services/3d-printing',
  },
];

export function ServiceGrid() {
  return (
    <section className="section section--primary" id="services">
      <div className="section__header">
        <h1>Hardware Development Services</h1>

      </div>
      <div className="grid grid--services">
        {services.map((service) => (
          <Link key={service.id} href={service.href} className="card card--service" style={{ textDecoration: 'none' }}>
            <h3>{service.title}</h3>
            {service.image && <img src={service.image} alt={service.title} />}
          </Link>
        ))}
      </div>

      <p className="section__lede services-lede">
          With deep expertise in rapid prototyping, custom electronics development, precision CNC machining and Firmware/Software development services, we provide the essential tools to transform ideas into physical products, serving a diverse array of industries.
        </p>
    </section>
  );
}


