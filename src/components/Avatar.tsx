import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, size = 'sm', disabled = false }: AvatarProps) {
  return (
    <div className={`${styles.avatar} ${styles[size]} ${disabled ? styles.disabled : styles.default}`}>
      {getInitials(name)}
    </div>
  );
}
