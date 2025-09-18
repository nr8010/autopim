import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  Boxes,
  Car,
  ChevronRight,
  Clipboard,
  Database,
  Download,
  Filter,
  Globe2,
  Image as ImageIcon,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Upload,
  Wand2,
  BarChart3,
  LineChart,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as RBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- Demo Data ---
const dqTrend = [
  { name: "Mo", value: 86 },
  { name: "Di", value: 87 },
  { name: "Mi", value: 88 },
  { name: "Do", value: 90 },
  { name: "Fr", value: 92 },
  { name: "Sa", value: 91 },
  { name: "So", value: 92 },
];

const coverage = [
  { name: "EU", value: 62 },
  { name: "NA", value: 48 },
  { name: "APAC", value: 37 },
  { name: "LATAM", value: 28 },
];

const tasks = [
  { id: "P-100234", title: "Bremsbelag-Set DE Übersetzen", status: "In Prüfung", dq: 74 },
  { id: "P-100512", title: "Ölfilter A123 – Medien ergänzen", status: "Neu", dq: 41 },
  { id: "P-100990", title: "Stoßdämpfer – ACES Mapping", status: "Aktiv", dq: 92 },
  { id: "P-101144", title: "Kühler – Verpackungsdaten GS1", status: "In Prüfung", dq: 68 },
];

const statusToBadge = (s: string) =>
  ({
    Neu: "bg-blue-100 text-blue-800",
    Aktiv: "bg-green-100 text-green-800",
    "In Prüfung": "bg-yellow-100 text-yellow-800",
    Gesperrt: "bg-red-100 text-red-800",
  } as const)[s] || "bg-gray-100 text-gray-800";

// --- Helper: Theme toggle with persistence & system-pref ---
function useTheme() {
  const getInitial = () => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  };
  const [dark, setDark] = useState<boolean>(getInitial);
  useEffect(() => {
    // Keep html in sync for global theming
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return { dark, setDark } as const;
}

export default function PIMDashboardPro() {
  const { dark, setDark } = useTheme();

  const dqAvg = useMemo(
    () => Math.round(dqTrend.reduce((a, b) => a + b.value, 0) / dqTrend.length),
    []
  );

  // Mobile nav state (Sheet)
  const [navOpen, setNavOpen] = useState(false);

  // Avoid hydration mismatch & ensure theme applied before first paint
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 text-gray-900 dark:text-gray-100">
        {/* Glass Topbar */}
        <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-white/40 dark:border-gray-800">
          <header className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-4">
            {/* Mobile: menu button */}
            <Sheet open={navOpen} onOpenChange={setNavOpen}>
              <SheetTrigger asChild>
                <Button
                  aria-label="Menü"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[92vw] sm:w-[400px] p-0">
                {/* Drawer content mirrors sidebar */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-md">
                      <Wand2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold leading-tight">Automotive PIM</h2>
                      <p className="text-xs text-muted-foreground">Navigation</p>
                    </div>
                  </div>
                  <Separator />
                  {[
                    { label: "Dashboard", icon: BarChart3 },
                    { label: "Produkte", icon: Boxes },
                    { label: "Fahrzeuge", icon: Car },
                    { label: "Medien", icon: ImageIcon },
                    { label: "Lieferanten", icon: Globe2 },
                    { label: "Datenhub", icon: Database },
                    { label: "Compliance", icon: ShieldCheck },
                  ].map((i) => (
                    <Button
                      key={i.label}
                      variant="ghost"
                      className="justify-start rounded-xl w-full"
                    >
                      <i.icon className="h-4 w-4 mr-2" /> {i.label}
                    </Button>
                  ))}
                  <div className="pt-2">
                    <Button
                      className="justify-start rounded-xl w-full"
                      variant="secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Neuer Artikel
                    </Button>
                  </div>
                  <div className="pt-2">
                    <Card className="rounded-2xl border-none bg-gradient-to-br from-teal-500 to-cyan-500 text-white overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          Quick Actions <ChevronRight className="h-4 w-4 opacity-80" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-2">
                        <Button
                          variant="secondary"
                          className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30"
                        >
                          <Upload className="h-4 w-4 mr-2" /> Import (TAF/BMEcat)
                        </Button>
                        <Button
                          variant="secondary"
                          className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30"
                        >
                          <Download className="h-4 w-4 mr-2" /> Export Presets
                        </Button>
                        <Button
                          variant="secondary"
                          className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30"
                        >
                          <Wand2 className="h-4 w-4 mr-2" /> KI-Validierung
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 flex-1"
            >
              <div className="hidden md:flex h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 items-center justify-center shadow-md">
                <Wand2 className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="font-semibold leading-tight">Automotive PIM</h1>
                <p className="text-xs text-muted-foreground">KI-Validierung · Multi-Tenant · API-first</p>
              </div>
              <div className="flex items-center gap-2 ml-0 sm:ml-2 p-1 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-gray-700 shadow-sm w-full max-w-[520px]">
                <Search className="w-4 h-4 ml-2 text-muted-foreground" />
                <Input
                  aria-label="Suche"
                  placeholder="Suche Produkte, Fahrzeuge, Medien…"
                  className="h-8 border-0 bg-transparent focus-visible:ring-0 text-sm flex-1"
                />
                <kbd className="mr-2 hidden sm:inline text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">Ctrl K</kbd>
              </div>
            </motion.div>

            <div className="flex items-center gap-1 sm:gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-label="Ansicht" variant="ghost" size="icon" className="rounded-xl">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ansicht</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Komfort-Dichte
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Kompakte Tabellen
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button aria-label="Benachrichtigungen" variant="ghost" size="icon" className="rounded-xl">
                <Bell className="h-5 w-5" />
              </Button>
              <Button aria-label="Einstellungen" variant="ghost" size="icon" className="rounded-xl">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                aria-label="Theme umschalten"
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setDark(!dark)}
              >
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </header>
        </div>

        {/* Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 sm:gap-6 px-3 sm:px-6 pb-24 sm:pb-10 pt-4 sm:pt-6">
          {/* Sidebar (hidden on mobile, available in drawer) */}
          <aside className="hidden md:block col-span-12 md:col-span-3 xl:col-span-2 space-y-3">
            <Card className="rounded-2xl border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {[
                  { label: "Dashboard", icon: BarChart3 },
                  { label: "Produkte", icon: Boxes },
                  { label: "Fahrzeuge", icon: Car },
                  { label: "Medien", icon: ImageIcon },
                  { label: "Lieferanten", icon: Globe2 },
                  { label: "Datenhub", icon: Database },
                  { label: "Compliance", icon: ShieldCheck },
                ].map((i) => (
                  <Button key={i.label} variant="ghost" className="justify-start rounded-xl">
                    <i.icon className="h-4 w-4 mr-2" /> {i.label}
                  </Button>
                ))}
                <Separator className="my-2" />
                <Button className="justify-start rounded-xl" variant="secondary">
                  <Plus className="h-4 w-4 mr-2" /> Neuer Artikel
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none bg-gradient-to-br from-teal-500 to-cyan-500 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  Quick Actions <ChevronRight className="h-4 w-4 opacity-80" />
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="secondary" className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30">
                  <Upload className="h-4 w-4 mr-2" /> Import (TAF/BMEcat)
                </Button>
                <Button variant="secondary" className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30">
                  <Download className="h-4 w-4 mr-2" /> Export Presets
                </Button>
                <Button variant="secondary" className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30">
                  <Wand2 className="h-4 w-4 mr-2" /> KI-Validierung
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main */}
          <section className="col-span-12 md:col-span-9 xl:col-span-10 space-y-4 sm:space-y-6">
            {/* Hero KPI strip */}
            <div className="grid grid-cols-12 gap-4">
              {[
                { title: "Datenqualität", value: `${dqAvg}%`, sub: "+2% vs. Vorwoche" },
                { title: "Artikel gesamt", value: "1.245.320", sub: "+12k neu" },
                { title: "Offene Freigaben", value: "38", sub: "5 überfällig" },
                { title: "Exporte 24h", value: "112", sub: "12 Partner" },
              ].map((kpi, idx) => (
                <motion.div
                  key={kpi.title}
                  className="col-span-12 sm:col-span-6 lg:col-span-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Card className="rounded-2xl border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">{kpi.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl sm:text-4xl font-semibold tracking-tight">{kpi.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              <Card className="col-span-12 lg:col-span-7 rounded-2xl border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm">DQ-Trend (7 Tage)</CardTitle>
                </CardHeader>
                <CardContent className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RLineChart data={dqTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" strokeWidth={3} dot={{ r: 3 }} />
                    </RLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-12 lg:col-span-5 rounded-2xl border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm">Coverage nach Region</CardTitle>
                </CardHeader>
                <CardContent className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RBarChart data={coverage} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                    </RBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Worklist + Detail */}
            <Card className="rounded-2xl border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-sm">Meine Aufgaben</CardTitle>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["Neu", "In Prüfung", "Aktiv", "Gesperrt"].map((s) => (
                          <DropdownMenuItem key={s}>{s}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" className="rounded-xl">
                      <Clipboard className="h-4 w-4 mr-2" />
                      In Clipboard
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Responsive list header */}
                <div className="hidden sm:grid grid-cols-12 gap-3 text-sm">
                  <div className="col-span-3 font-medium text-muted-foreground">ID</div>
                  <div className="col-span-5 font-medium text-muted-foreground">Titel</div>
                  <div className="col-span-2 font-medium text-muted-foreground">Status</div>
                  <div className="col-span-2 font-medium text-muted-foreground">DQ</div>
                  <Separator className="col-span-12 my-1" />
                  {tasks.map((t) => (
                    <React.Fragment key={t.id}>
                      <div className="col-span-3 flex items-center gap-2">
                        <Badge variant="outline" className="rounded-lg">
                          {t.id}
                        </Badge>
                      </div>
                      <div className="col-span-5 flex items-center justify-between">
                        <div>{t.title}</div>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="rounded-xl">
                              Details <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-xl">
                            <SheetHeader>
                              <SheetTitle>{t.title}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-4">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Regel-Check: 12/14 bestanden</span>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Datenqualitäts-Score</p>
                                <Progress value={t.dq} className="h-2" />
                                <div className="text-xs mt-1">{t.dq}%</div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <Button variant="secondary" className="rounded-xl">
                                  <Wand2 className="h-4 w-4 mr-2" /> KI-Autofix
                                </Button>
                                <Button className="rounded-xl">
                                  <Upload className="h-4 w-4 mr-2" /> Medien ergänzen
                                </Button>
                                <Button variant="outline" className="rounded-xl">
                                  <Download className="h-4 w-4 mr-2" /> Datenblatt
                                </Button>
                                <Button variant="outline" className="rounded-xl">
                                  <Globe2 className="h-4 w-4 mr-2" /> TecDoc prüfen
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                      <div className="col-span-2">
                        <Badge className={`rounded-lg ${statusToBadge(t.status)}`}>
                          {t.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <Progress value={t.dq} className="h-2" />
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Mobile list */}
                <div className="sm:hidden space-y-3">
                  {tasks.map((t) => (
                    <Card
                      key={t.id}
                      className="rounded-2xl border border-gray-200 dark:border-gray-800"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="rounded-lg">
                            {t.id}
                          </Badge>
                          <Badge className={`rounded-lg ${statusToBadge(t.status)}`}>
                            {t.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm">{t.title}</div>
                        <div className="mt-3">
                          <Progress value={t.dq} className="h-2" />
                          <div className="text-xs mt-1">{t.dq}%</div>
                        </div>
                        <div className="mt-3 flex items-center justify-end">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                Details <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-xl">
                              <SheetHeader>
                                <SheetTitle>{t.title}</SheetTitle>
                              </SheetHeader>
                              <div className="mt-4 space-y-4">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">Regel-Check: 12/14 bestanden</span>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Datenqualitäts-Score</p>
                                  <Progress value={t.dq} className="h-2" />
                                  <div className="text-xs mt-1">{t.dq}%</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <Button variant="secondary" className="rounded-xl">
                                    <Wand2 className="h-4 w-4 mr-2" /> KI-Autofix
                                  </Button>
                                  <Button className="rounded-xl">
                                    <Upload className="h-4 w-4 mr-2" /> Medien ergänzen
                                  </Button>
                                  <Button variant="outline" className="rounded-xl">
                                    <Download className="h-4 w-4 mr-2" /> Datenblatt
                                  </Button>
                                  <Button variant="outline" className="rounded-xl">
                                    <Globe2 className="h-4 w-4 mr-2" /> TecDoc prüfen
                                  </Button>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              <Card className="col-span-12 xl:col-span-7 rounded-2xl border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm">Partner-Exports (Top 5)</CardTitle>
                </CardHeader>
                <CardContent className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="value"
                        nameKey="name"
                        data={[
                          { name: "TecDoc", value: 42 },
                          { name: "Amazon", value: 24 },
                          { name: "eBay", value: 14 },
                          { name: "Händler X", value: 12 },
                          { name: "OEM", value: 8 },
                        ]}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {["#0ea5e9", "#14b8a6", "#22c55e", "#a78bfa", "#f59e0b"].map(
                          (c, i) => (
                            <Cell key={i} fill={c} />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-12 xl:col-span-5 rounded-2xl border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur shadow-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="text-sm">Aktivitäten</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    {[
                      { t: "Freigabe abgeschlossen", s: "Produkt P-100880", k: "vor 12 Min" },
                      { t: "TAF-Import", s: "4.320 Artikel aktualisiert", k: "vor 1 Std" },
                      { t: "DQ-Regeln", s: "15 Warnungen behoben", k: "gestern" },
                      { t: "Neue Medien", s: "28 Bilder zugeordnet", k: "gestern" },
                    ].map((a, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                          <LineChart className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{a.t}</div>
                          <div className="text-muted-foreground">{a.s}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{a.k}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Mobile Bottom Quick Actions */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden">
          <div className="rounded-2xl border border-white/40 dark:border-gray-800 bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-xl px-2 py-2 flex items-center gap-2">
            <Button size="sm" variant="secondary" className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30">
              <Upload className="h-4 w-4 mr-1" /> Import
            </Button>
            <Button size="sm" variant="secondary" className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" variant="secondary" className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30">
              <Wand2 className="h-4 w-4 mr-1" /> KI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
