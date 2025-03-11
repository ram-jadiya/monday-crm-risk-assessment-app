import React from "react";
import AppContent from "./AppContent";
import AppProvider from "./contexts/AppProvider";

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
