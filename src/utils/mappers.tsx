import { 
  Dumbbell, BookOpen, Save, Zap, TrendingUp, Shirt, Utensils, 
  PenTool, Droplets, Moon, Car, Code, Bike, CheckCircle 
} from 'lucide-react-native';
import { colors } from '../config/theme';

// Converte a string "WEIGHTS" do backend no componente <Dumbbell />
export const getIconComponent = (iconName: string) => {
  const icons: any = {
    WEIGHTS: Dumbbell,
    BOOK: BookOpen,
    SAVE: Save,
    MEDITATION: Zap,
    RUNNING: TrendingUp,
    BIKE: Bike,
    HANGER: Shirt,
    CUTLERY: Utensils,
    FONT: PenTool,
    WATER: Droplets,
    MOON: Moon,
    CAR: Car,
    PENCIL: PenTool,
    CODE: Code,
  };

  return icons[iconName] || Save; // Ícone padrão se não encontrar
};

// Converte a string "RED" do backend na cor Hexadecimal
export const getColorValue = (colorName: string) => {
  const map: any = {
    RED: colors.habit.red,
    BLUE: colors.habit.blue,
    GREEN: colors.habit.green,
    YELLOW: colors.habit.yellow,
    PURPLE: colors.habit.purple,
    PINK: colors.habit.pink,
  };

  return map[colorName] || colors.habit.blue;
};