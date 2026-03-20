import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { c as cn } from "../main.mjs";
const sizeClasses = {
  sm: "h-10 md:h-12 w-auto",
  md: "h-16 md:h-20 w-auto",
  lg: "h-32 md:h-48 w-auto"
};
const Logo = forwardRef(({ size = "sm", className }, ref) => {
  return /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center justify-center", className), children: /* @__PURE__ */ jsx(
    "img",
    {
      src: "/gocivique-logo-examen-civique.png",
      alt: "Logo Officiel GoCivique - Préparation Examen Civique Français",
      className: cn("object-contain", sizeClasses[size]),
      width: size === "lg" ? 500 : size === "md" ? 200 : 120,
      height: size === "lg" ? 192 : size === "md" ? 80 : 48,
      fetchPriority: size === "lg" ? "high" : void 0
    }
  ) });
});
Logo.displayName = "Logo";
export {
  Logo as L
};
