
import "./Card.css";

type Props = {
  title?: string;
  subtitle?: string;
  img?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ title, subtitle, children, onClick, className }: Props) {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="title">{title}</h3>}
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="content">{children}</div>
    </div>
  );
}


