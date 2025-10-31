export type MenuTileProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};