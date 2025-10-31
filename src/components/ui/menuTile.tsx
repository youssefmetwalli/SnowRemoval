import { MenuTileProps } from "../../types/menuTiles";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";


export const MenuTile = ({
  title,
  subtitle,
  icon,
  onClick,
  variant = "secondary",
}: MenuTileProps) => (
  <Card
    onClick={onClick}
    className={[
      "group cursor-pointer transition duration-200",
      "border-slate-200 hover:shadow-lg hover:-translate-y-0.5",
      "ring-0 hover:ring-2 hover:ring-blue-200/80",
      variant === "primary"
        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        : "bg-white",
    ].join(" ")}
  >
    <CardContent className="flex flex-col items-center justify-center gap-3 p-6 aspect-square sm:aspect-[4/3] lg:aspect-[5/3]">
      <div
        className={[
          "flex items-center justify-center rounded-2xl",
          "w-12 h-12 text-2xl",
          variant === "primary"
            ? "bg-white/15"
            : "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
        ].join(" ")}
        aria-hidden
      >
        {icon}
      </div>
      <p
        className={
          variant === "primary"
            ? "font-semibold"
            : "font-semibold text-slate-700"
        }
      >
        {title}
      </p>
      {subtitle ? (
        <Badge
          className={
            variant === "primary"
              ? "bg-white/20 text-white"
              : "bg-sky-50 text-blue-600"
          }
        >
          {subtitle}
        </Badge>
      ) : null}
    </CardContent>
  </Card>
);