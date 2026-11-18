// Ventana clásica de JRPG: degradado azul con doble borde.
export default function Window({ title, children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`win ${className}`} {...rest}>
      {title && <h2 className="win-title">{title}</h2>}
      {children}
    </Tag>
  );
}
