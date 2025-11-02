export function getCategoryBadgeClasses(category: string) {
  switch (category) {
    case "wants":
      return "bg-yellow-200 text-black";
    case "needs":
      return "bg-red-800 text-white";
    case "bills":
      return "bg-blue-800 text-white";
    case "groceries":
      return "bg-green-800 text-white";
    case "rare_buy":
      return "bg-amber-800 text-white";
    case "commission":
      return "bg-pink-200 text-black";
    case "eat-out":
      return "bg-purple-200 text-black";
    case "transport":
      return "bg-purple-800 text-white";
    default:
      return "";
  }
}
