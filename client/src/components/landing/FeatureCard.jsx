export default function FeatureCard({ icon: Icon, title, description, tint }) {
  return (
    <div className="feature-card">
      <div className={`icon-tile icon-${tint}`}>
        <Icon size={20} stroke={1.8} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
