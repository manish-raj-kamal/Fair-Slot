import { useEffect } from 'react';
import {
  IconListSearch,
  IconSend,
  IconActivity,
  IconUsers,
  IconAdjustments,
  IconGavel,
} from '@tabler/icons-react';

import Navbar from '../components/landing/Navbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import FeatureCard from '../components/landing/FeatureCard.jsx';
import SecurityPanel from '../components/landing/SecurityPanel.jsx';
import CtaBanner from '../components/landing/CtaBanner.jsx';
import Footer from '../components/landing/Footer.jsx';

import '../components/landing/LandingPage.css';

const howItWorksCards = [
  {
    icon: IconListSearch,
    title: 'Choose a utility',
    description:
      'Open the utility board, check pricing and rules, and select an available slot.',
    tint: 'violet',
  },
  {
    icon: IconSend,
    title: 'Submit your booking',
    description:
      'FairSlot checks overlap, policy limits, and fairness rules before finalizing status.',
    tint: 'gold',
  },
  {
    icon: IconActivity,
    title: 'Track status in one place',
    description:
      'Approved, waitlisted, and completed bookings stay visible on your dashboard.',
    tint: 'sage',
  },
];

const benefitsCards = [
  {
    icon: IconUsers,
    title: 'For residents',
    description:
      'Find availability quickly and track every booking without back-and-forth messages.',
    tint: 'violet',
  },
  {
    icon: IconAdjustments,
    title: 'For admins',
    description:
      'Manage utilities, resolve conflicts, and monitor usage from one operations view.',
    tint: 'gold',
  },
  {
    icon: IconGavel,
    title: 'For governance',
    description:
      'Role-based access and action-level audit logs keep decisions transparent.',
    tint: 'sage',
  },
];

export default function LandingPage() {
  useEffect(() => {
    document.title = 'FairSlot — Shared utility booking';
  }, []);

  return (
    <div className="landing-root">
      <div className="washshape"></div>
      <div className="washshape-2"></div>

      <Navbar />

      <div className="wrap">
        <Hero />

        <section id="how-it-works">
          <div className="section-eyebrow">How it works</div>
          <div className="section-title">A direct flow your team can trust</div>
          <div className="grid-3">
            {howItWorksCards.map((card) => (
              <FeatureCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
                tint={card.tint}
              />
            ))}
          </div>
        </section>

        <section id="benefits">
          <div className="section-eyebrow">Benefits</div>
          <div className="section-title">
            Less manual coordination, better outcomes
          </div>
          <div className="grid-3">
            {benefitsCards.map((card) => (
              <FeatureCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
                tint={card.tint}
              />
            ))}
          </div>

          <div id="security">
            <SecurityPanel />
          </div>
        </section>

        <CtaBanner />

        <Footer />
      </div>
    </div>
  );
}
