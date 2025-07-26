export interface FoodItem {
  id?: number;             // dolazi od servera, ne moraš ga slati pri kreiranju
  name: string;
  caloriesPer100g: number;
}
