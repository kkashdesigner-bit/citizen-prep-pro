// Design-sync bundle entry — re-exports the curated GoCivique UI primitives.
// package-build.mjs receives this via --entry; esbuild bundles these from
// source (no library dist exists), assigning every named export to
// window.GoCiviqueUI. Sub-components (CardHeader, DialogContent, …) come
// along via `export *` so authored previews can compose them.
export * from "@/components/ui/button";
export * from "@/components/ui/card";
export * from "@/components/ui/badge";
export * from "@/components/ui/alert";
export * from "@/components/ui/input";
export * from "@/components/ui/label";
export * from "@/components/ui/tabs";
export * from "@/components/ui/accordion";
export * from "@/components/ui/checkbox";
export * from "@/components/ui/switch";
export * from "@/components/ui/dialog";
export * from "@/components/ui/select";
export * from "@/components/ui/avatar";
export * from "@/components/ui/progress";
export * from "@/components/ui/tooltip";
export * from "@/components/ui/separator";
export * from "@/components/ui/skeleton";
export * from "@/components/ui/radio-group";
export * from "@/components/ui/textarea";
