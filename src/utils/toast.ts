import toast from "react-hot-toast";
import { PullCordHandle } from "./handles";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      icon: "✅",
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      icon: "❌",
    });
  },
  
  handleDiscovered: (handle: PullCordHandle) => {
    const categoryEmojis = {
      seasonal: "🌹",
      zoo: "🦁", 
      ocean: "🌊",
      household: "🏠",
      misc: "🎯"
    };
    
    toast.success(
      `New handle discovered! ${handle.icon}`,
      {
        icon: categoryEmojis[handle.category],
        duration: 5000,
      }
    );
  },
  
  vaultOpened: () => {
    toast("Vault opened - view your collection!", {
      icon: "🗄️",
    });
  }
}; 