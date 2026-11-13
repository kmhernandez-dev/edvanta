/** Iconos de la experiencia de clase (la lista vive en api/lib/experiencia.js). */
import {
  Beaker, FlaskConical, TestTube, Microscope, Pill, Syringe, Factory, Building2,
  ShieldCheck, ClipboardCheck, ClipboardList, FileText, FileCheck, FileSearch, Files, BookOpen,
  Scale, Gavel, Landmark, Globe, Users, UserCheck, GraduationCap, Wind,
  Droplets, Thermometer, Gauge, Filter, Wrench, Settings, Cpu, Database,
  LineChart, BarChart3, Sigma, Target, Crosshair, Ruler, Timer, CalendarClock,
  AlertTriangle, Bug, Biohazard, Recycle, Trash2, Lock, Fingerprint, Eye,
  Search, CheckCircle2, XCircle, RefreshCw, Repeat, GitBranch, Workflow, Route,
  Package, PackageCheck, Boxes, Tag, Truck, Warehouse, Lightbulb, Puzzle,
  Layers, Network, Zap, Sparkles, HardHat, Hand, Shirt, DoorOpen,
  Signature, Percent, Flame, Snowflake, Sun, Clock, Award, Calculator,
  Atom,
} from 'lucide-react';

export const ICONO = {
  Beaker, FlaskConical, TestTube, Microscope, Pill, Syringe, Factory, Building2,
  ShieldCheck, ClipboardCheck, ClipboardList, FileText, FileCheck, FileSearch, Files, BookOpen,
  Scale, Gavel, Landmark, Globe, Users, UserCheck, GraduationCap, Wind,
  Droplets, Thermometer, Gauge, Filter, Wrench, Settings, Cpu, Database,
  LineChart, BarChart3, Sigma, Target, Crosshair, Ruler, Timer, CalendarClock,
  AlertTriangle, Bug, Biohazard, Recycle, Trash2, Lock, Fingerprint, Eye,
  Search, CheckCircle2, XCircle, RefreshCw, Repeat, GitBranch, Workflow, Route,
  Package, PackageCheck, Boxes, Tag, Truck, Warehouse, Lightbulb, Puzzle,
  Layers, Network, Zap, Sparkles, HardHat, Hand, Shirt, DoorOpen,
  Signature, Percent, Flame, Snowflake, Sun, Clock, Award, Calculator,
  Atom,
};

export const iconoDe = (nombre) => ICONO[nombre] || Sparkles;
