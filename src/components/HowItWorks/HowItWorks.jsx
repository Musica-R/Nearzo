import { Search, ListChecks, PhoneCall, PartyPopper } from "lucide-react";
import "./HowItWorks.css";

const steps = [
  { icon: Search, no: "01", title: "Search", desc: "Search for services, providers or categories near you." },
  { icon: ListChecks, no: "02", title: "Compare", desc: "Compare ratings, reviews and pricing to choose the best." },
  { icon: PhoneCall, no: "03", title: "Connect", desc: "Call, WhatsApp or enquire directly with the provider." },
  { icon: PartyPopper, no: "04", title: "Get It Done", desc: "Book the best fit and get your work done, hassle-free." },
];

const HowItWorks = () => (
  <section className="section how-it-works">
    <div className="container">
      <div className="hiw-heading">
        <span className="eyebrow">Get started</span>
        <h2>
          How It <span className="hero-highlight">Works</span>
        </h2>
        <p className="text-muted">
          Finding the right local help is simple with Lokal.
        </p>
      </div>

      <div className="hiw-steps">
        {steps.map(({ icon: Icon, no, title, desc }, idx) => (
          <div className="hiw-step" key={no}>
            <div className="hiw-icon">
              <Icon size={26} />
              <span className="hiw-no">{no}</span>
            </div>
            <h3>{title}</h3>
            <p className="text-muted">{desc}</p>
            {idx < steps.length - 1 && <span className="hiw-connector" />}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
