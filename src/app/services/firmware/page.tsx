import Link from 'next/link';
import { Technologies } from './technologies';

export const dynamic = 'force-static';

import './firmware.css';

const capabilities = [
  {
    title: 'C/C++ & Assembly',
    icon: '{ }',
    items: ['MISRA C compliant code', 'Mission-critical systems', 'Bare-metal & RTOS-based', 'Low-level driver development'],
  },
  {
    title: 'Hardware Interfaces',
    icon: '⇄',
    items: ['High-speed: USB 2/3, MIPI-DSI/CSI, I2S, DDR3/4', 'Low-speed: I2C, SPI, QSPI, UART, CAN', 'Industrial: Ethernet, RS-485, SDIO', '1-Wire, PWM, ADC/DAC'],
  },
  {
    title: 'RF & IoT Protocols',
    icon: '📡',
    items: ['Cellular: NB-IoT, LTE-M, LTE, GPRS', 'Wireless: WiFi, BLE, ZigBee, LoRa, UWB', 'Mesh: Thread, Z-Wave, 6LoWPAN', 'NFC, RFID (433 MHz, 860–960 MHz)'],
  },
  {
    title: 'Communication Stack',
    icon: '⟷',
    items: ['MQTT, HTTP/HTTPS, FTP', 'Modbus TCP/RTU, SNMP', 'TCP/IP, UDP/IP, DLMS', 'AWS IoT, Azure IoT Hub'],
  },
  {
    title: 'Security & Crypto',
    icon: '🔒',
    items: ['AES encryption', 'SSL/TLS — WolfSSL, mbedTLS', 'Secure boot mechanisms', 'Custom secure algorithms'],
  },
  {
    title: 'RTOS & Embedded Linux',
    icon: '⚙',
    items: ['FreeRTOS, Zephyr OS, TI-RTOS', 'Yocto, Buildroot, ROS/ROS 2', 'LVGL, TouchGFX, emWin GUI', 'TensorFlow Lite, sensor fusion'],
  },
];

const process = [
  {
    num: '01',
    title: 'Requirements & Spec',
    desc: 'Hardware components, communication protocols, power management, and functional logic are fully specified before any code is written.',
  },
  {
    num: '02',
    title: 'Architecture Design',
    desc: 'Block diagrams, UML, workflow charts, and API/interface definitions — establishing module relationships and system states.',
  },
  {
    num: '03',
    title: 'Agile Development',
    desc: '2-week sprints with modular C/C++ implementation. Each sprint includes testing on target hardware to catch issues early.',
  },
  {
    num: '04',
    title: 'Code Review & QA',
    desc: 'MISRA C compliance validation, senior engineer review, and QA sign-off. Git-based review flows with Jira tracking.',
  },
  {
    num: '05',
    title: 'Release & Delivery',
    desc: 'Git version tagging (e.g. v1.2.0), full technical documentation, and demo applications for each release.',
  },
  {
    num: '06',
    title: 'Hardware Bring-Up',
    desc: 'Custom test firmware for all interfaces, UART console output, and real-time hardware-firmware debugging collaboration.',
  },
];

const platforms = {
  MCU: ['STM32 (F, G, H, L, WB, MP1)', 'Nordic nRF52 / nRF53 / nRF9160', 'NXP i.MX-RT, LPC families', 'Espressif ESP32 / ESP8266', 'TI MSP430, MSP432, CC series', 'Atmel/Microchip AVR, SAM', 'Silicon Labs EFR32'],
  MPU: ['NXP i.MX 6 / 7 / 8 series', 'STM32MP1', 'Raspberry Pi CM3 / CM4 / CM5', 'NVIDIA Jetson (Nano, Orin)', 'Qualcomm Snapdragon', 'Allwinner A-series'],
  Tools: ['STM32CubeIDE, MCUXpresso', 'Segger Embedded Studio', 'GCC, Clang, LLVM toolchains', 'J-Link, OpenOCD, JTAG/SWD', 'Wireshark, logic analyzers', 'Git, Jira, Confluence'],
};

function KeyCapabilities() {
  return (
    <section className="fw-section">
      <h2 className="fw-section__title">Key Capabilities</h2>
      <div className="fw-capabilities">
        {capabilities.map((cap) => (
          <div key={cap.title} className="fw-cap-card">
            <div className="fw-cap-card__icon">{cap.icon}</div>
            <h3 className="fw-cap-card__title">{cap.title}</h3>
            <ul className="fw-cap-card__list">
              {cap.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function DevelopmentProcess() {
  return (
    <section className="fw-section">
      <h2 className="fw-section__title">Development Process</h2>
      <div className="fw-process">
        {process.map((step) => (
          <div key={step.num} className="fw-process__step">
            <span className="fw-process__num">{step.num}</span>
            <div>
              <h3 className="fw-process__step-title">{step.title}</h3>
              <p className="fw-process__step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SupportedPlatforms() {
  return (
    <section className="fw-section">
      <h2 className="fw-section__title">Supported Platforms</h2>
      <div className="fw-platforms">
        {Object.entries(platforms).map(([group, items]) => (
          <div key={group} className="fw-platform-group">
            <h3 className="fw-platform-group__title">{group}</h3>
            <ul className="fw-platform-group__list">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function FirmwareContent() {
  return (
    <article className="article__body">
      <Technologies />

      <Link style={{ margin: '20px 50px', textAlign: 'center' }} className="button button--primary" href="/quote-form">
        Need firmware for your device?
      </Link>

      <KeyCapabilities />
      <DevelopmentProcess />
      <SupportedPlatforms />

      <Link style={{ margin: '20px 50px', textAlign: 'center' }} className="button button--primary" href="/quote-form">
        Let&apos;s turn your idea into reality!
      </Link>
    </article>
  );
}

export default function FirmwareServicePage() {
  return (
    <main className="section blog service-page">
      <div className="section__header">
        <div className="section__header-content">
          <h1>Firmware development for smart devices</h1>
          <p className="section__lede">
            Our experienced team of firmware engineers develops sophisticated embedded systems for IoT, robotics and industrial applications.
          </p>
        </div>
        <img className="article__hero" src="/images/articles/firmware.png" alt="Firmware development for smart devices" />
        <div className="gradient"></div>
      </div>
      <FirmwareContent />
    </main>
  );
}
